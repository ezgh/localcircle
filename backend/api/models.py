from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class Category(models.Model):
    name = models.CharField(max_length=255)


class Area(models.Model):
    name = models.CharField(max_length=255)


# authentication models
class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    area = models.ForeignKey(Area, on_delete=models.SET_NULL, null=True, blank=True)
    email_notifications_active = models.BooleanField(default=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True,
        default="profile_pictures/default.jpeg",
    )

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def save(self, *args, **kwargs):
        self.first_name = self.first_name.capitalize()
        self.last_name = self.last_name.capitalize()

        super().save(*args, **kwargs)

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email


class ListingImage(models.Model):
    image = models.ImageField(upload_to="listings/")


class Listing(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    description = models.TextField(max_length=4000)
    is_live = models.BooleanField(default=True)
    images = models.ManyToManyField(ListingImage)


class Bookmark(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "listing")


class ChatMessage(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="user")
    sender = models.ForeignKey(
        UserAccount, on_delete=models.CASCADE, related_name="sender"
    )
    receiver = models.ForeignKey(
        UserAccount, on_delete=models.CASCADE, related_name="receiver"
    )

    message = models.CharField(max_length=500)
    is_read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    class Meta:
        ordering = ["date"]
        verbose_name_plural = "Message"

    def __str__(self):
        return f"{self.sender} - {self.receiver}"

    @property
    def sender_profile(self):
        return self.sender

    @property
    def receiver_profile(self):
        return self.receiver
