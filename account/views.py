from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from django.http import HttpRequest, HttpResponse

from .forms import RegistrationForm


def log_in(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect('frontend')

    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect('frontend')
        else:
            messages.error(request,
                           'The given username or password is invalid.')
    form = AuthenticationForm()

    return render(request, 'account/index.html', {'form': form})


@login_required
def log_out(request: HttpRequest) -> HttpResponse:
    username = request.user.username
    logout(request)
    messages.success(request,
                     f'The user {username} was successfully logged out!')
    return redirect('account_index')


def register(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect('frontend')

    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            form.save()
            messages.success(
                request,
                f'The account was successfully created for {username}.'
            )
            return redirect('account_index')
    else:
        form = RegistrationForm()

    return render(request, 'account/register.html', {'form': form})
