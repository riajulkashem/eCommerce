from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from user.api.v1.views import UserViewSet, CustomTokenObtainPairView, LogoutView

router = DefaultRouter()
router.register(
    r"user", UserViewSet, basename="user"
)  # endpoints [user, user-register, user-profile]

urlpatterns = [
    path("", include(router.urls)),
    path("user/login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("user/logout/", LogoutView.as_view(), name="logout"),
    path("user/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
