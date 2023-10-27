from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AreaViewSet, CategoryViewSet, ListingViewSet


router = DefaultRouter()
router.register(r"categories", CategoryViewSet)
router.register(r"areas", AreaViewSet)
router.register(r"listings", ListingViewSet)
router.register(r"listings/:id", ListingViewSet)
router.register(r"areas/:id", AreaViewSet)
router.register(r"categories/:id", CategoryViewSet)


urlpatterns = [
    path("", include(router.urls)),
]
