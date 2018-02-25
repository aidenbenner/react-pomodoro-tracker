import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Timer extends Component {
    constructor() {
        super()
        this.state = { pause:true,
            done: false,
            resetSeconds: 25 * 60,
            startSeconds: 25 * 60,
            remaining: 25 * 60,
            startTime: Date.now()}

        this.tick.bind(this)
        this.setTimerVal = this.setTimerVal.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.reset = this.reset.bind(this)
    }

    componentDidMount() {
        this.timer = setInterval(this.tick.bind(this), 50);
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    setTimerVal(seconds){
        this.setState({pause: true, done:false, resetSeconds: seconds, startSeconds: seconds, remaining:seconds, startTime: Date.now()})
    }

    start() {
        console.log("HIT")
        this.setState({pause : false, startTime: Date.now()})
    }

    stop() {
        this.setState({pause : true, startSeconds:this.state.remaining})
    }

    tick() {
        if(this.state.pause){
            if (this.state.remaining > 0) {
                let now = Date.now()
                let dtime = (now - this.state.startTime) / 1000
                console.log(dtime)
                this.setState({remaining:Math.max(0, this.state.startSeconds - dtime)})
            }
            if(this.state.remaining == 0 && !this.state.done){
                this.setState({done: true})
                let a = new Audio("/alarm.mp3")
                a.play()
            }

        }
    }

    reset() {
        this.stop()
        this.setTimerVal(this.state.resetSeconds)
    }

    render() {
        return (
            <div id="timer">
                <button onClick={() => this.setTimerVal(25 * 60)}> Pomodoro </button>
                <button onClick={() => this.setTimerVal(10 * 60)}> Long Break </button>
                <button onClick={() => this.setTimerVal(5 * 60)}> Short Break </button>
                <button onClick={() => this.setTimerVal(5)}> Debug </button>
                <TimerText time={this.state.remaining}/>
                <button onClick={this.start}> Start </button>
                <button onClick={this.stop}> Stop </button>
                <button onClick={this.reset}> Reset </button>
            </div>
        )
    }
}

function formatNum(x) {
    if(x < 9) {
        return "0" + x
    }
    return x
}

class TimerText extends Component {
    getTime() {
        return Math.floor(this.props.time / 60) + ":" + formatNum(Math.floor(this.props.time % 60))
    }


    render() {
        return (
            <p>
                {this.getTime()}
            </p>
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
