from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListingViewSet, CategoryViewSet, AreaViewSet


router = DefaultRouter()
router.register(r"categories", CategoryViewSet)
router.register(r"areas", AreaViewSet)
router.register(r"listings", ListingViewSet)
urlpatterns = [
    path("", include(router.urls)),
]
