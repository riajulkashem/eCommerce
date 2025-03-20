from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from user.api.v1.views import UserViewSet, CustomTokenObtainPairView, LogoutView, RegistrationView

router = DefaultRouter()
router.register(
    r"user", UserViewSet, basename="user"
)  # endpoints [user, user-register, user-profile]

urlpatterns = [
    path("", include(router.urls)),
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("auth/login/", RegistrationView.as_view(), name="register"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
