# views.py
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from django.db.models import Subquery, OuterRef, Q
from .serializers import (
    BookmarkSerializer,
    ListingSerializer,
    CategorySerializer,
    AreaSerializer,
    UserInfoSerializer,
    MessageSerializer,
)
from .models import Bookmark, ChatMessage, Listing, Area, Category, UserAccount

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


# inbox
class MyInbox(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        messages = ChatMessage.objects.filter(
            id__in=Subquery(
                UserAccount.objects.filter(
                    Q(sender__receiver=user_id) | Q(receiver__sender=user_id)
                )
                .distinct()
                .annotate(
                    last_message=Subquery(
                        ChatMessage.objects.filter(
                            Q(sender=OuterRef("id"), receiver=user_id)
                            | Q(receiver=OuterRef("id"), sender=user_id)
                        )
                        .order_by("-id")[:1]
                        .values_list("id", flat=True)
                    )
                )
                .values_list("last_message", flat=True)
                .order_by("-id")
            )
        ).order_by("-id")

        return messages


# get messages
class GetMessages(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        sender_id = self.kwargs["sender_id"]
        receiver_id = self.kwargs["receiver_id"]

        messages = ChatMessage.objects.filter(
            sender__in=[sender_id, receiver_id], receiver__in=[sender_id, receiver_id]
        )
        return messages


# send message
class SendMessage(generics.CreateAPIView):
    queryset = ChatMessage.objects.all()
    serializer_class = MessageSerializer
