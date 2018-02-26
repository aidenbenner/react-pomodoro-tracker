import React, { Component } from 'react';
import moment  from 'moment';
import logo from './logo.svg';
import './App.css';

class Timer extends Component {
    constructor() {
        super()
        this.state = { pause:true,
            intervalName: "Pomodoro",
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

    setTimerVal(name, seconds){
        this.setState({initialStartDate:moment.now(), intervalName:name, pause: true, done:false, resetSeconds: seconds, startSeconds: seconds, remaining:seconds, startTime: Date.now()})
    }

    start() {
        this.setState({pause : false, startTime: Date.now()})
    }

    stop() {
        this.setState({pause : true, startSeconds:this.state.remaining})
    }

    tick() {
        if(!this.state.pause){
            if (this.state.remaining > 0) {
                let now = Date.now()
                let dtime = (now - this.state.startTime) / 1000
                this.setState({remaining:Math.max(0, this.state.startSeconds - dtime)})
            }
            if(this.state.remaining == 0 && !this.state.done){
                this.setState({done: true})
                let audio = new Audio("/alarm.mp3")
                audio.volume = 0.01
                audio.play()
                this.props.onCompleteInterval({startDate: this.state.initialStartDate, name: this.state.intervalName,completedDate:moment.now()})
            }
        }
    }

    reset() {
        this.stop()
        this.setTimerVal(this.state.intervalName, this.state.resetSeconds)
    }

    render() {
        return (
            <div id="timer">
                <button onClick={() => this.setTimerVal("Pomodoro", 25 * 60)}> Pomodoro </button>
                <button onClick={() => this.setTimerVal("Long Break", 10 * 60)}> Long Break </button>
                <button onClick={() => this.setTimerVal("Short Break", 5 * 60)}> Short Break </button>
                <button onClick={() => this.setTimerVal("Debug", 5)}> Debug </button>
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
            <p className="timer-text">
                {this.getTime()}
            </p>
        )
    }
}

class PomodoroLog extends Component {
    constructor() {
        super()
    }

    render() {
        const logs = this.props.history.reverse()
        if(logs != null){
            const logList = logs.map((x) => {
                    return (
                        <li key={x.completedDate}>
                            <p>{x.name} - {moment(x.startDate).format("LTS") + " " + moment(x.completedDate).format("LTS")} </p>
                        </li>
                    )
            });

            return (
                <div>
                    <p> History </p>
                    <ul>
                        {logList}
                    </ul>
                </div>
            )
        }
        return (
            <div>
                <p> History </p>
            </div>
        )
    }
}

class App extends Component {
    constructor() {
        super()
        this.completePomodoro = this.completePomodoro.bind(this)
        this.state = {}
        this.state.history = []
    }


    completePomodoro(hist) {
        let newHistory = this.state.history.slice()
        newHistory.push(hist)
        this.setState({history: newHistory})
    }

    render() {
        return (
            <div className="App">
                <Timer onCompleteInterval={this.completePomodoro}/>
                <PomodoroLog history={this.state.history}/>
            </div>
        );
    }
}

export default App;
