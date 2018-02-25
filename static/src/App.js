import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Timer extends Component {
    render() {
        return (
            <div id="timer">
                <TimeSetButton text="Pomodoro" />
                <TimeSetButton text="Short Break"/>
                <TimeSetButton text="Long Break"/>
                <TimeSetButton text="Custom" />
                <TimerText time="25:00"/> 
                <TimeControlButton text="Start"/>
                <TimeControlButton text="Stop"/>
                <TimeControlButton text="Reset"/>
            </div>
        )
    }
}

class TimeSetButton extends Component {
    render() {
        return (
            <button>
                {this.props.text}
            </button>
        )
    }
}



class TimerText extends Component {
    render() {
        return (
            <p> 
                {this.props.time}
            </p>
        )
    }
}

class TimeControlButton extends Component {
    render() {
        return (
            <button>
                {this.props.text}
            </button>
        )
    }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Timer />
      </div>
    );
  }
}

export default App;
