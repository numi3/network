from django.urls import path

from . import views

urlpatterns = [
    path("posts", views.get_posts, name="get_posts"),
    path("posts/<int:start>/<int:end>", views.get_posts, name="get_posts"),
    path("posts/new", views.new_post, name="new_post"),
    path("users/", views.get_username, name="get_username"),
    path("users/<int:id>", views.get_username, name="get_username")
]