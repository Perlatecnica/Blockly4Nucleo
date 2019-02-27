#include "mbed.h"
  DigitalOut digital_LED1(LED1);


int main() {
  while (true) {
    digital_LED1 = 1;
     wait_ms(1000);
     digital_LED1 = 0;
     wait_ms(1000);
  }

}