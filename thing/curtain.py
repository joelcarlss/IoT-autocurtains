from machine import Pin, ADC
import time


class Curtain:

    def __init__(self, motor):
        self.bottom_position = 100
        self.current_position = 1
        self.motor = motor
        self.motor.power_off()

    def getCurrentPercent(self):
        return int(self.current_position / self.bottom_position * 100)

    def getValueFromPercent(self, percent):
        return int(self.bottom_position * (percent / 100))

    def setPercent(self, percent):
        if percent > 100 or percent < 0:
            return
        level = self.getValueFromPercent(percent)
        print('Percent: {}, Value: {}'.format(percent, level))
        self.setLevel(level)

    def setLevel(self, level):
        if level >= 0 and level <= self.bottom_position:
            if level == self.current_position:
                return
            else:
                self.goToLevel(level)

    def goToLevel(self, level):
        print('Going to: {}'.format(level))
        self.motor.dir.value(0)
        steps = level - self.current_position
        print(level)
        if level < self.current_position:
            self.motor.dir(1)
        else:
            self.motor.dir(0)
        self.motor.go_revolution(abs(steps))
        self.current_position = level

    def force_level(self, command):
        if command == 2:
            self.motor.dir(0)
            self.motor.go_revolution(1)
        elif command == 1:
            self.motor.dir(1)
            self.motor.go_revolution(1)

    def force_up(self):
        self.motor.dir(1)
        self.motor.go_revolution(1)
        self.current_position -= 1
        if self.current_position < 0:
            self.current_position = 0

    def force_down(self):
        self.motor.dir(0)
        self.motor.go_revolution(1)
        self.current_position += 1
        if self.current_position > self.bottom_position:
            self.bottom_position = self.current_position
