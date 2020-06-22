from machine import Pin, ADC
import time

# Class made by Stefan Nilsson


class Joystick:
    # neutral position (0-1023)
    xNeutral = 490
    yNeutral = 467

    def __init__(self, xPin, yPin, zPin):
        adc = ADC(bits=10)
        self.xPin = adc.channel(pin=xPin, attn=ADC.ATTN_11DB)
        self.yPin = adc.channel(pin=yPin, attn=ADC.ATTN_11DB)
        self.zPin = Pin(zPin, mode=Pin.IN, pull=Pin.PULL_UP)

    def getXValue(self):
        return self.xPin.value() - self.xNeutral

    def getYValue(self):
        return self.yPin.value() - self.yNeutral

    def getZValue(self):
        return not self.zPin.value()


joystick = Joystick('P17', 'P16', 'P10')
while True:
    print("X: %s" % (joystick.getXValue()))
    print("Y: %s" % (joystick.getYValue()))
    print(joystick.getZValue())
    print('-' * 10)
    time.sleep(0.1)
