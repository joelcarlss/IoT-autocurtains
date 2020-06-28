from machine import Pin, ADC
import time


class Curtain:

    def __init__(self, motor):
        self.bottom_position = 100
        self.current_position = 12
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
        self.motor.go_revolution(abs(steps))
        self.current_position = level
