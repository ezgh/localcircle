from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Listing, Category, Area, Bookmark, ChatMessage, ListingImage


User = get_user_model()


class UserInfoSerializer(serializers.ModelSerializer):
    listing_count = serializers.IntegerField(source="listing_set.count", read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "get_full_name",
            "email_notifications_active",
            "area",
            "profile_picture",
            "listing_count",
        )


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = (
            "id",
            "email",
            "get_full_name",
            "first_name",
            "last_name",
            "password",
            "area",
            "email_notifications_active",
            "profile_picture",
        )


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ["image"]


class ListingSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    isBookmarked = serializers.SerializerMethodField()
    images = ListingImageSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = "__all__"

    def get_owner_name(self, obj):
        return obj.user.get_full_name()

    def get_isBookmarked(self, obj):
        request = self.context.get("request")
        user = request.user if request and hasattr(request, "user") else None
        if user and user.is_authenticated:
            return Bookmark.objects.filter(user=user, listing=obj).exists()
        return False


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = "__all__"


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = "__all__"


class MessageSerializer(serializers.ModelSerializer):
    receiver_profile = UserInfoSerializer(read_only=True)
    sender_profile = UserInfoSerializer(read_only=True)
    listing = ListingSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = [
            "id",
            "user",
            "sender",
            "receiver",
            "message",
            "date",
            "is_read",
            "receiver_profile",
            "sender_profile",
            "listing",
        ]
