"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]


from django.urls import include, path
from rest_framework import routers

from .modsandbox import views


router = routers.DefaultRouter()
router.register(r'post', views.PostHandlerViewSet, basename='post')
router.register(r'spam', views.SpamHandlerViewSet, basename='spam')

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('reddit_login/', views.reddit_login),
    path('reddit_auth/', views.reddit_auth),
    path('reddit_logged/', views.reddit_logged),
    path('reddit_logout/', views.reddit_logout),
    path('apply_rules/', views.apply_rules),
    path('mod_subreddits/', views.mod_subreddits),
    path('removal_reasons/', views.removal_reasons),
    path('community_rules/', views.community_rules),
    path('get_moderators/', views.get_moderators),
    path('save_files/', views.save_files),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls'))
]
