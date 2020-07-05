from machine import Pin
import time
from time import sleep_us


class Motor:
    def __init__(self, step_pin, dir_pin, enable_pin):
        self.stp = Pin(step_pin, mode=Pin.OUT)
        self.dir = Pin(dir_pin, mode=Pin.OUT)
        self.enb = Pin(enable_pin, mode=Pin.OUT)

        self.step_time = 600  # us 20 standard
        self.steps_per_rev = 6400
        self.dir.value(0)

    def power_on(self):
        self.enb.value(1)

    def power_off(self):
        self.enb.value(0)

    def go_steps(self, step_count):
        print('Goning steps: {}, Direction: {}'.format(step_count, self.dir()))
        for i in range(abs(step_count)):
            self.stp.value(1)
            sleep_us(self.step_time)
            self.stp.value(0)
            sleep_us(self.step_time)

    def rotate_degrees(self, degrees):
        steps = int(degrees / 360 * self.steps_per_rev)
        self.go_steps(steps)

    def go_revolution(self, rev_count):
        """Perform given number of full revolutions."""
        self.go_steps(rev_count * self.steps_per_rev)

    def set_step_time(self, us):
        """Set time in microseconds between each step."""
        if us < 20:  # 20 us is the shortest possible for esp8266
            self.step_time = 20
        else:
            self.step_time = us
