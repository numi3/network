from rest_framework.response import Response
from rest_framework.decorators import api_view 
from rest_framework.exceptions import PermissionDenied
from network.models import User, Post
from .serializers import PostSerializer, UserSerializer
from django.shortcuts import get_object_or_404

# Create your views here.


# send a get request to obtain
# the information from the latest posts,
# {start} being the latest post and
# {end} being the {end}th latest post.

@api_view(["GET"])
def get_posts(request, start, end):
    if end > start:
        posts = Post.objects.all().order_by('-id')[start:end]
        if len(posts) < 1:
            return Response({"error": "No posts found."}, status=404)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    return Response("Error: end number must be higher than start number.")


# send a post request to write a new post
@api_view(["POST"])
def new_post(request):
    if request.user.is_authenticated:
        # replace the author with currently logged in user to avoid hijacking
        data = request.data.copy()
        data['author'] = request.user.id
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    return Response({"detail": "Permission denied."}, status=403)

# send a get request to
# translate a user's ID to his actual username
@api_view(["GET"])
def get_username(request, id):
    users = get_object_or_404(User, id=id)
    serializer = UserSerializer(users, many=False)
    return Response({
        "id": serializer.data["id"],
        "username": serializer.data["username"]
    })