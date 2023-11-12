from django.urls import path

from .views import (
    AreaList,
    AreaDetail,
    CategoryList,
    CategoryDetail,
    ListingList,
    ListingDetail,
    UserBookmarks,
    UserListings,
    UserInfo,
    BookmarkCreate,
    BookmarkDelete,
)

urlpatterns = [
    path("categories/", CategoryList.as_view(), name="category-list"),
    path("categories/<int:pk>/", CategoryDetail.as_view(), name="category-detail"),
    path("areas/", AreaList.as_view(), name="area-list"),
    path("areas/<int:pk>/", AreaDetail.as_view(), name="area-detail"),
    path("listings/", ListingList.as_view(), name="listing-list"),
    path("listings/<int:pk>/", ListingDetail.as_view(), name="listing-detail"),
    path("user_listings/<int:user_id>/", UserListings.as_view(), name="user_listings"),
    path("user_info/<int:pk>/", UserInfo.as_view(), name="user_info"),
    path("bookmarks/", BookmarkCreate.as_view(), name="create-bookmark"),
    path(
        "bookmarks/listing/<int:listing_id>/",
        BookmarkDelete.as_view(),
        name="delete-bookmark",
    ),
    path(
        "bookmarks/user/<int:user_id>/", UserBookmarks.as_view(), name="user-bookmarks"
    ),
]
