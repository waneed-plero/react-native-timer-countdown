// tslint:disable-next-line: no-implicit-dependencies
import * as React from 'react';
// tslint:disable-next-line: no-implicit-dependencies
import { Text } from 'react-native';

/**
 * A customizable countdown component for React
 *
 * @export
 * @class TimerCountdown
 * @extends {React.Component}
 */

interface ITimerCountdownProps {
  initialSecondsRemaining: number;
  interval?: number;
  formatSecondsRemaining?: (milliseconds: number) => string;
  onTick?: (secondsRemaining: number) => void;
  onTimeElapsed?: () => void;
  allowFontScaling?: boolean;
  style?: object;
}

export default class TimerCountdown extends React.Component<ITimerCountdownProps> {
  private mounted: boolean = false;
  public readonly state = {
    secondsRemaining: this.props.initialSecondsRemaining,
    timeoutId: null,
    previousSeconds: null
  };

  public componentDidMount(): void {
    this.mounted = true;
    this.tick();
  }

  public componentWillReceiveProps(newProps): void {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }
    this.setState({
      previousSeconds: null,
      secondsRemaining: newProps.initialSecondsRemaining
    });
  }

  public componentDidUpdate(): void {
    if (!this.state.previousSeconds && this.state.secondsRemaining > 0 && this.mounted) {
      this.tick();
    }
  }

  public componentWillUnmount(): void {
    this.mounted = false;
    clearTimeout(this.state.timeoutId);
  }

  private tick = () => {
    const currentSeconds = Date.now();
    const dt = this.state.previousSeconds ? currentSeconds - this.state.previousSeconds : 0;
    const interval = this.props.interval;

    // correct for small variations in actual timeout time
    const intervalSecondsRemaing = interval - (dt % interval);
    let timeout = intervalSecondsRemaing;

    if (intervalSecondsRemaing < interval / 2.0) {
      timeout += interval;
    }

    const secondsRemaining = Math.max(this.state.secondsRemaining - dt, 0);
    const isComplete = this.state.previousSeconds && secondsRemaining <= 0;

    if (this.mounted) {
      if (this.state.timeoutId) {
        clearTimeout(this.state.timeoutId);
      }
      this.setState({
        timeoutId: isComplete ? null : setTimeout(this.tick, timeout),
        previousSeconds: currentSeconds,
        secondsRemaining
      });
    }

    if (isComplete) {
      if (this.props.onTimeElapsed) {
        this.props.onTimeElapsed();
      }
      return;
    }

    if (this.props.onTick) {
      this.props.onTick(secondsRemaining);
    }
  };

  private getFormattedTime = (milliseconds: number): string => {
    if (this.props.formatSecondsRemaining) {
      return this.props.formatSecondsRemaining(milliseconds);
    }
    const remainingSec = Math.round(milliseconds / 1000);

    const seconds: number = parseInt((remainingSec % 60).toString(), 10);
    const minutes: number = parseInt(((remainingSec / 60) % 60).toString(), 10);
    const hours: number = parseInt((remainingSec / 3600).toString(), 10);

    const s = seconds < 10 ? '0' + seconds : seconds;
    const m = minutes < 10 ? '0' + minutes : minutes;
    let h = hours < 10 ? '0' + hours : hours;
    h = h === '00' ? '' : h + ':';
    return h + m + ':' + s;
  };

  public render(): React.ReactNode {
    const secondsRemaining: number = this.state.secondsRemaining;
    const allowFontScaling: boolean = this.props.allowFontScaling;
    const style = this.props.style;
    return (
      <Text allowFontScaling={allowFontScaling} style={style}>
        {this.getFormattedTime(secondsRemaining)}
      </Text>
    );
  }

  public static defaultProps = {
    interval: 1000,
    formatSecondsRemaining: null,
    onTick: null,
    onTimeElapsed: null
  };
}
