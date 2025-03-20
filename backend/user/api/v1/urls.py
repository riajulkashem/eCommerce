from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from user.api.v1.views import (
    CustomTokenObtainPairView, LogoutView, RegistrationView, PasswordChangeView,
    UserDetailView, UserProfileView
)

urlpatterns = [
    path("user/detail/", UserDetailView.as_view(), name="user-detail"),
    path("user/profile/", UserProfileView.as_view(), name="user-profile"),
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("auth/register/", RegistrationView.as_view(), name="register"),
    path("auth/password-change/", PasswordChangeView.as_view(), name="password_change"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
