[![Build Status](https://travis-ci.org/dzionek/todo-list.svg?branch=master)](https://travis-ci.org/dzionek/todo-list)
[![codecov](https://codecov.io/gh/dzionek/todo-list/branch/master/graph/badge.svg)](https://codecov.io/gh/dzionek/todo-list)
[![Checked with mypy](http://www.mypy-lang.org/static/mypy_badge.svg)](http://mypy-lang.org/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/dzionek/todo-list.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/dzionek/todo-list/context:javascript)
[![Language grade: Python](https://img.shields.io/lgtm/grade/python/g/dzionek/todo-list.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/dzionek/todo-list/context:python)
# todo-list
Yet another ToDo List app made to test full-stack integration. Create an account and then add tasks you need to do. You can mark them as "done", remove them, edit their content, assign them one of 4 colors and then filter them by their color.

Technologies used:
- **Frameworks**
  - backend: Django (Python) + Django REST
  - frontend: React (TypeScript) bundled with WebPack
- **Linters**
  - backend: Flake8, Mypy
  - frontend: TypeScript ESLint
- **Testing**
  - Unit Tests and Integration Tests
    - backend: Pytest
    - frontend: Jest + React Testing Library
  - End-to-End
    - Selenium (Python)
- **Styling**
  - Bootstrap
  - SCSS
- **Containerization**
  - Docker
- **Continuous Integration (CI)**
  - LGTM
  - Travis
  - CodeCov


## Usage

Install [Docker](https://www.docker.com/get-started), build using docker compose, and run.
```bash
docker-compose up -d
```

Your website should be available at [localhost:5000](localhost:5000).
