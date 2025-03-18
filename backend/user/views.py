from django.shortcuts import render


def home(request):
    return render(template_name='home.html', request=request)
