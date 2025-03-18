from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from user.api.v1.views import UserViewSet

router = DefaultRouter()
router.register(
    r"user", UserViewSet, basename="user"
)  # endpoints [user, user-register, user-profile]

urlpatterns = [
    path("", include(router.urls)),
    path("user/login/", TokenObtainPairView.as_view(), name="login"),
    path("user/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
