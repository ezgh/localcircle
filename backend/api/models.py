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
    )

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email


class Listing(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    description = models.TextField(max_length=400)
    is_live = models.BooleanField(default=False)
    image = models.ImageField(upload_to="listings/", null=True, blank=True)


class Bookmark(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "listing")
