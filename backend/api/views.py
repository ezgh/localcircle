# views.py
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from django.db.models import Q, Max
from .serializers import (
    BookmarkSerializer,
    ListingSerializer,
    CategorySerializer,
    AreaSerializer,
    UserInfoSerializer,
    MessageSerializer,
)
from .models import (
    Bookmark,
    ChatMessage,
    Listing,
    Area,
    Category,
    UserAccount,
    ListingImage,
)

User = get_user_model()


# all categories
class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# individual category
class CategoryDetail(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# all areas
class AreaList(generics.ListCreateAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer


# individual area
class AreaDetail(generics.RetrieveAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer


# all listings
class ListingList(generics.ListCreateAPIView):
    serializer_class = ListingSerializer

    def get_queryset(self):
        queryset = Listing.objects.all()
        area_id = self.request.query_params.get("areaId")
        category_id = self.request.query_params.get("categoryId")

        if area_id:
            queryset = queryset.filter(area_id=area_id).order_by("-id")
        if category_id:
            queryset = queryset.filter(category_id=category_id).order_by("-id")

        if not area_id and not category_id:
            return queryset.order_by("-id")
        else:
            return queryset

    def perform_create(self, serializer):
        images = self.request.FILES.getlist("images")
        serializer.save(
            is_live=True,
            images=[ListingImage.objects.create(image=image) for image in images],
        )


class ListingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ListingSerializer(instance, context={"request": request})
        return Response(serializer.data)


# listings of a specific user
class UserListings(generics.ListAPIView):
    serializer_class = ListingSerializer

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = UserAccount.objects.get(id=user_id)
        queryset = Listing.objects.filter(user=user).order_by("-created_at")

        return queryset[:10]


# get users info
class UserInfo(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserInfoSerializer
    queryset = User.objects.all()
    parser_classes = [MultiPartParser, FormParser]


# create a bookmark
class BookmarkCreate(generics.CreateAPIView):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# view and delete a bookmark
class BookmarkDelete(generics.RetrieveDestroyAPIView):
    queryset = Bookmark.objects.all()
    lookup_field = "listing_id"
    serializer_class = BookmarkSerializer

    def destroy(self, request, *args, **kwargs):
        listing_id = self.kwargs.get("listing_id")
        user_id = request.data.get("user")

        bookmark = get_object_or_404(Bookmark, listing__id=listing_id, user__id=user_id)
        bookmark.delete()

        return Response(
            {"detail": "Bookmark deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


# get all the bookmarkmarks with the given user id.
class UserBookmarks(generics.ListAPIView):
    serializer_class = ListingSerializer

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        bookmarks = Bookmark.objects.filter(user=user_id).select_related("listing")
        return [bookmark.listing for bookmark in bookmarks]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# all message list


class MyInbox(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        user_id = self.kwargs["user_id"]

        last_message_queryset = (
            ChatMessage.objects.filter(Q(sender_id=user_id) | Q(receiver_id=user_id))
            .values("listing", "sender_id", "receiver_id")
            .annotate(max_date=Max("date"))
        )

        last_messages = []
        for entry in last_message_queryset:
            listing_id = entry["listing"]
            sender_id = entry["sender_id"]
            receiver_id = entry["receiver_id"]
            max_date = entry["max_date"]

            last_message = ChatMessage.objects.filter(
                Q(
                    sender_id=sender_id,
                    receiver_id=user_id,
                    listing=listing_id,
                    date=max_date,
                )
                | Q(
                    sender_id=user_id,
                    receiver_id=receiver_id,
                    listing=listing_id,
                    date=max_date,
                )
            ).first()

            if last_message:
                last_messages.append(last_message)

        last_messages.sort(key=lambda x: x.date, reverse=True)

        return last_messages


# get messages between 2 users
class GetMessages(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        sender_id = self.kwargs["sender_id"]
        receiver_id = self.kwargs["receiver_id"]
        listing_id = self.kwargs["listing_id"]

        messages = ChatMessage.objects.filter(
            sender__in=[sender_id, receiver_id],
            receiver__in=[sender_id, receiver_id],
            listing_id=listing_id,
        )

        return messages


# send message
class SendMessage(generics.CreateAPIView):
    queryset = ChatMessage.objects.all()
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        listing_id = self.request.data.get("listing_id")
        message = serializer.save(listing_id=listing_id, user=self.request.user)

        receiver_email_notifications = (
            message.receiver_profile.email_notifications_active
        )

        if receiver_email_notifications:
            email_template_path = "email_template.html"
            email_subject = "You have a new message."

            context = {
                "receiver_name": message.receiver_profile.get_full_name(),
                "sender_name": message.sender_profile.get_full_name(),
                "message_content": message.message,
            }

            html_message = render_to_string(email_template_path, context)

            # Send the email
            send_mail(
                email_subject,
                "",
                settings.EMAIL_HOST_USER,
                [message.receiver_profile.email],
                fail_silently=False,
                html_message=html_message,
            )


# mark as read
class MarkMessageAsRead(generics.UpdateAPIView):
    queryset = ChatMessage.objects.all()
    serializer_class = MessageSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_read = True
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
