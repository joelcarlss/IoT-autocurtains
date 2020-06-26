from machine import Pin, ADC
import time


class Curtain:

    def __init__(self, uPin, dPin):
        self.bottomLevel = 1543
        self.currentLevel = 45
        self.lowestAllowedPercent = 90
        self.upPin = Pin(uPin, mode=Pin.OUT)
        self.downPin = Pin(dPin, mode=Pin.IN)

    def goToPercent(self, amout):
        if amout > self.lowestAllowedPercent and amout < 0:
            return

    def getCurrentPercent(self):
        return int(self.currentLevel / self.bottomLevel * 100)

    def getValueFromPercent(self, percent):
        return int(self.bottomLevel * (percent / 100))

    def setLevel(self, level):
        if level >= 0 and level <= (self.bottomLevel * (self.lowestAllowedPercent / 100)):
            if level > self.currentLevel:
                self.goDownToLevel(level)
            else:
                self.goUpToLevel(level)

    def setPercent(self, percent):
        if percent > self.lowestAllowedPercent or percent < 0:
            return
        level = self.getValueFromPercent(percent)
        self.setLevel(level)

    def goDownToLevel(self, level):
        while (self.currentLevel < level):
            self.stepDown()
            self.currentLevel += 1

    def goUpToLevel(self, level):
        while (self.currentLevel > level):
            self.stepUp()
            self.currentLevel -= 1

    def stepDown(self):
        print("going DOWN form {}". format(self.currentLevel))
        time.sleep(0.1)

    def stepUp(self):
        print("going UP form {}".format(self.currentLevel))
        time.sleep(0.1)
