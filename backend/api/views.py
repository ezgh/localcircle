# views.py
from rest_framework import generics
from .serializers import ListingSerializer, CategorySerializer, AreaSerializer
from .models import Listing, Area, Category


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


# individual listing
class ListingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
