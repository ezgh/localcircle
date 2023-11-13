from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Bookmark, Listing


@receiver(post_save, sender=Bookmark)
def update_listing_bookmark_status(sender, instance, **kwargs):
    listing = instance.listing
    listing.save()


@receiver(post_delete, sender=Bookmark)
def update_listing_unbookmark_status(sender, instance, **kwargs):
    listing = instance.listing
    listing.save()
