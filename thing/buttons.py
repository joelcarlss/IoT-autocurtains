
from machine import Pin, ADC
import pycom
import time


button_one = Pin('P12', mode=Pin.IN)
button_two = Pin('P10', mode=Pin.IN)


def get_button_press():
    if button_one() == 1 and button_two() == 1:
        return 2
    elif button_one() == 1:
        return 1
    elif button_two() == 1:
        return - 1
    else:
        return 0


while True:
    print(get_button_press())
    time.sleep(0.1)
