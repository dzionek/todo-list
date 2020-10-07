from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.wait import WebDriverWait
import urllib.parse
import sys
import time

from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.contrib.auth.models import User

from api.models import Task

from .utils import get_card_title, get_card_description, edit_card


class TestPolls(StaticLiveServerTestCase):
    serialized_rollback = True

    @staticmethod
    def create_user() -> User:
        try:
            User.objects.get(username='testUser')
        except User.DoesNotExist:
            return User.objects.create_user(
                username='testUser', email='test@gmail.com',
                password='testPassword'
            )

    def log_in(self):
        self.create_user()
        self.driver.get(self.live_server_url)

        self.driver.find_element_by_name('username').send_keys('testUser')
        self.driver.find_element_by_name('password').send_keys('testPassword')
        self.driver.find_element_by_tag_name('button').click()

        WebDriverWait(self.driver, 10).until(
            lambda driver: driver.find_element_by_id('username')
                                 .get_attribute('innerHTML')
        )

        self.assertIn(
            'You are logged in as <b id="username">testUser</b>',
            self.driver.page_source
        )

    def add_tasks(self) -> None:
        user = self.create_user()
        Task.objects.create(
            user=user, name="Name 1", description="Description 1"
        )
        Task.objects.create(
            user=user, name="Name 2", description="Description 2",
            color="red"
        )
        Task.objects.create(
            user=user, name="Name 3", description="Description 3",
            is_finished=True
        )

        another_user = User.objects.create_user(
            username='anotherUser', email='another@gmail.com',
            password='anotherPassword'
        )

        Task.objects.create(
            user=another_user, name="Another 2",
            description="Another Description 2", color="yellow"
        )
        Task.objects.create(
            user=another_user, name="Another 3",
            description="Another Description 3", is_finished=True
        )

    def setUp(self) -> None:
        super().setUp()
        options = Options()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        options.add_argument("--headless")

        if sys.platform == 'win32':
            self.driver = webdriver.Chrome(
                'e2e/local_webdriver/chrome_windows', options=options
            )
        elif sys.platform == 'linux':
            options.add_argument("--no-sandbox")
            options.add_argument('--disable-dev-shm-usage')
            self.driver = webdriver.Chrome(
                '/usr/bin/chromedriver', options=options
            )

    def tearDown(self) -> None:
        self.driver.close()
        super().tearDown()

    def test_invalid_login(self) -> None:
        self.driver.get(self.live_server_url)
        self.assertNotIn(
            "username or password is invalid", self.driver.page_source
        )

        self.driver.find_element_by_name('username').send_keys('incorrect')
        self.driver.find_element_by_name('password').send_keys('password')
        self.driver.find_element_by_tag_name('button').click()

        self.assertIn(
            "username or password is invalid", self.driver.page_source
        )

    def test_register(self) -> None:
        url = urllib.parse.urljoin(self.live_server_url, "/register")
        self.driver.get(url)

        self.driver.find_element_by_name('username')\
            .send_keys('new_user')
        self.driver.find_element_by_name('email')\
            .send_keys('new_user@mail.com')
        self.driver.find_element_by_name('password1')\
            .send_keys('Super!password1')
        self.driver.find_element_by_name('password2')\
            .send_keys('Super!password1')

        self.driver.find_element_by_tag_name('button').click()

        self.assertIn(
            "The account was successfully created for new_user.",
            self.driver.page_source
        )

        self.assertEqual(self.driver.current_url, f'{self.live_server_url}/')
        user = User.objects.get(username='new_user')
        self.assertIsNotNone(user)
        self.assertEqual(user.email, 'new_user@mail.com')

    def test_login(self) -> None:
        self.log_in()

    def test_logout(self) -> None:
        self.log_in()
        self.driver.find_element_by_link_text('Log out').click()

        self.assertEqual(self.driver.current_url, f'{self.live_server_url}/')
        self.assertIn(
            'testUser was successfully logged out!', self.driver.page_source
        )

    def test_load_tasks(self) -> None:
        self.add_tasks()
        self.log_in()

        todo_items = self.driver.find_elements_by_css_selector('.todo-item')
        parsed_todo_items = {
            (
                get_card_title(todo_item),
                get_card_description(todo_item)
            )
            for todo_item in todo_items
        }

        self.assertCountEqual(
            parsed_todo_items,
            {
                ('Name 1', 'Description 1'),
                ('Name 2', 'Description 2')
            }
        )

        done_items = self.driver.find_elements_by_css_selector('.done-item')
        parsed_done_items = {
            (
                get_card_title(done_item),
                get_card_description(done_item)
            )
            for done_item in done_items
        }

        self.assertCountEqual(
            parsed_done_items,
            {('Name 3', 'Description 3')}
        )

    def test_add_task(self) -> None:
        self.add_tasks()
        self.log_in()

        self.driver.find_element_by_id('add-task-title')\
            .send_keys('New task')
        self.driver.find_element_by_id('add-task-description')\
            .send_keys('New description')
        self.driver.find_element_by_id('add-card-button').click()

        WebDriverWait(self.driver, 10).until(
            lambda driver: any([
                get_card_title(todo_item) == 'New task'
                for todo_item
                in driver.find_elements_by_css_selector('.todo-item')
            ])
        )

        todo_items = self.driver.find_elements_by_css_selector('.todo-item')

        parsed_todo_items = {
            (
                get_card_title(todo_item),
                get_card_description(todo_item)
            )
            for todo_item in todo_items
        }

        self.assertCountEqual(
            parsed_todo_items,
            {
                ('Name 1', 'Description 1'),
                ('Name 2', 'Description 2'),
                ('New task', 'New description')
            }
        )

        self.assertEqual(Task.objects.last().name, 'New task')

    def test_delete_task(self) -> None:
        self.add_tasks()
        self.log_in()

        self.driver.find_element_by_css_selector('.todo-item svg.x-symbol') \
                   .click()

        WebDriverWait(self.driver, 30).until(
            lambda driver:
            len(driver.find_elements_by_class_name('todo-item')) == 1
        )

        self.driver.find_element_by_css_selector('.done-item svg.x-symbol') \
                   .click()

        WebDriverWait(self.driver, 30).until(
            lambda driver:
            driver.find_elements_by_class_name('done-item') == []
        )

        user = User.objects.get(username='testUser')
        self.assertEqual(Task.objects.filter(user=user)
                                     .filter(is_finished=False).count(), 1)
        self.assertEqual(Task.objects.filter(user=user)
                                     .filter(is_finished=True).count(), 0)

    def test_done_undone(self) -> None:
        self.add_tasks()
        self.log_in()

        for done_button in self.driver.find_elements_by_class_name('btn-done'):
            done_button.click()

        WebDriverWait(self.driver, 30).until(
            lambda driver:
            driver.find_elements_by_class_name('todo-item') == []
        )

        self.assertEqual(
            len(self.driver.find_elements_by_class_name('done-item')), 3
        )

        user = User.objects.get(username='testUser')
        self.assertEqual(Task.objects.filter(user=user)
                                     .filter(is_finished=False).count(), 0)
        time.sleep(3)
        for undone_button in \
                self.driver.find_elements_by_class_name('btn-undone'):
            undone_button.click()

        WebDriverWait(self.driver, 30).until(
            lambda driver:
            driver.find_elements_by_class_name('done-item') == []
        )

        self.assertEqual(
            len(self.driver.find_elements_by_class_name('todo-item')), 3
        )

        user = User.objects.get(username='testUser')
        self.assertEqual(Task.objects.filter(user=user)
                                     .filter(is_finished=True).count(), 0)

    def test_edit(self) -> None:
        self.add_tasks()
        self.log_in()

        todo_item = self.driver.find_element_by_class_name('todo-item')

        initial_title = todo_item.find_element_by_tag_name('h5') \
                                 .get_attribute('innerHTML')
        initial_description = todo_item.find_element_by_tag_name('p') \
                                       .get_attribute('innerHTML')

        # Discarding changes
        edit_card(todo_item, self.driver)

        todo_item.find_element_by_class_name('btn-back').click()

        self.assertEqual(get_card_title(todo_item), initial_title)
        self.assertEqual(get_card_description(todo_item), initial_description)

        # Saving changes
        edit_card(todo_item, self.driver)

        todo_item.find_element_by_class_name('btn-save').click()

        WebDriverWait(self.driver, 10).until(
            lambda driver: driver.find_element_by_class_name('btn-done')
        )

        self.assertEqual(get_card_title(todo_item), 'Edited t')
        self.assertEqual(get_card_description(todo_item), 'Edited d')
