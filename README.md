[![npm version](https://badge.fury.io/js/react-native-timer-countdown.svg)](https://badge.fury.io/js/react-native-timer-countdown)
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)](https://www.npmjs.com/package/react-native-timer-countdown)

# React Native Timer Countdown

A customizable countdown component for React Native (iOS and Android).

## Install

```sh
npm install --save react-native-timer-countdown
```

or

```sh
yarn add react-native-timer-countdown
```

## Usage

```javascript
import TimerCountdown from 'react-native-timer-countdown';

render() {
    return (
        <TimerCountdown
            initialSecondsRemaining={1000*60}
            onTick={secondsRemaining => console.log('tick', secondsRemaining)}
            onTimeElapsed={() => console.log('complete')}
            allowFontScaling={true}
            style={{ fontSize: 20 }}
        />
    )
}
```

## Props

| Name | Description | Type | Required | Default Value |
| :--- | :----- | :--- | :---: | :---: |
| initialSecondsRemaining | The time remaining for the countdown (in ms) | number | ✓ |  |
| interval | The time between timer ticks (in ms). | number |  | 1000ms |
| allowFontScaling | to allow font scaling | bool |  | false |
| style | The custom styling which will be applied to the Text component | style |  |  |
| formatSecondsRemaining | A function that formats the secondsRemaining | func | | |
| onTick | A function to call each tick. It returns the remaining seconds. | func | | |
| onTimeElapsed | A function to call when the countdown completes | func |  | |

## FAQ

### Why does this timer restart whenever I click any button?

#### What's happening

buttons clicked -> state changes -> react rerenders -> timer restarts

#### How to not to restart the timer component

Provided the state changes only occur in component B, A component will not rerender. As a result, no more unintended timer restarts.

```javascript
import React, { Component } from "react";
import { StyleSheet, Button, View } from "react-native";
import TimerCountdown from "./TimerCountdown";

const A = () => (
  <View style={styles.container}>
    <B />
    <Timer />
  </View>
);
export default A;

class B extends Component {
  state = { isPressed: false };
  render() {
    return (
      <View styles={{ flex: 1 }}>
        <Button
          title={`${this.state.isPressed ? "Button Pressed" : "Button"}`}
          onPress={() => {
            this.setState({ isPressed: true });
          }}
        />
      </View>
    );
  }
}

const Timer = () => (
  <TimerCountdown
    initialSecondsRemaining={1000 * 60}
    onTick={secondsRemaining => console.log("tick", secondsRemaining)}
    onTimeElapsed={() => console.log("complete")}
    allowFontScaling={true}
    style={{ fontSize: 20 }}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
```

## Author

Noel Yoo

## License

MIT
