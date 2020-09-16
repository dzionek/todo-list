from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.chrome.webdriver import WebDriver


def get_card_title(card: WebElement) -> str:
    return card.find_element_by_tag_name('h5').get_attribute('innerHTML')


def get_card_description(card: WebElement) -> str:
    return card.find_element_by_tag_name('p').get_attribute('innerHTML')


def edit_card(card: WebElement, driver: WebDriver) -> None:
    card.find_element_by_class_name('btn-edit').click()

    WebDriverWait(driver, 10).until(
        lambda d: d.find_element_by_class_name('btn-edit')
    )

    input_title = card.find_element_by_name('taskTitle')
    input_description = card.find_element_by_name('taskDescription')
    input_title.clear()
    input_title.send_keys('Edited t')
    input_description.clear()
    input_description.send_keys('Edited d')
