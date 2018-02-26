import React, { Component } from 'react';
import moment  from 'moment';
import logo from './logo.svg';
import './App.css';
import Particles from 'react-particles-js';
import Cookies from 'universal-cookie';

var LineChart = require("react-chartjs").Line;

class Timer extends Component {
    constructor() {
        super()
        this.state = { pause:true,
            intervalName: "Pomodoro",
            done: false,
            resetSeconds: 25 * 60,
            startSeconds: 25 * 60,
            remaining: 25 * 60,
            startTime: Date.now()};

        this.audio = new Audio("/alarm.mp3");
        this.audio.volume = 0.01;

        this.tick.bind(this)
        this.setTimerVal = this.setTimerVal.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.tick.bind(this), 50);
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    stopAudio() {
        this.audio.pause();
        this.audio.setTime = 0
    }

    setTimerVal(name, seconds){
        this.stopAudio();
        this.setState({initialStartDate:moment.now(),
            intervalName:name,
            pause: true,
            done:false,
            resetSeconds: seconds,
            startSeconds: seconds,
            remaining:seconds,
            startTime: Date.now()});
    }

    start() {
        if(!this.state.pause) return;
        this.stopAudio();
        this.setState({pause : false, startTime: Date.now()});
    }

    stop() {
        this.stopAudio();
        this.setState({pause : true, startSeconds:this.state.remaining});
    }

    tick() {
        if(!this.state.pause){
            if (this.state.remaining > 0) {
                let now = Date.now();
                let dtime = (now - this.state.startTime) / 1000;
                this.setState({remaining:Math.max(0, this.state.startSeconds - dtime)});
            }
            if(this.state.remaining == 0 && !this.state.done){
                this.setState({done: true});
                this.audio.play();
                this.props.onCompleteInterval({startDate: this.state.initialStartDate,
                    name: this.state.intervalName,
                    completedDate:moment.now()});
            }
        }
    }

    reset() {
        this.stop();
        this.setTimerVal(this.state.intervalName, this.state.resetSeconds);
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
        return Math.floor(this.props.time / 60) + ":" + formatNum(Math.floor(this.props.time % 60));
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
    constructor(props) {
        super(props)
    }

    render() {
        const logs = this.props.history.reverse()
        if(logs != null){
            const logList = logs.map((x) => {
                    return (
                        <li key={x.completedDate}>
                            <p>{x.name} - {moment(x.startDate).format("LTS")
                            + " "
                            + moment(x.completedDate).format("LTS")} </p>
                        </li>
                    )
            });

            return (
                <div className={this.props.className}>
                    <p> History </p>
                    <ul>
                        {logList}
                    </ul>
                </div>
            )
        }
        return (
            <div className={this.props.className}>
                <p> History </p>
            </div>
        )
    }
}

function weekChartData(d){
    return {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [
            {
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: d
            }
        ]
    }
}


const coptions = {
    scaleFontColor: "#FFFFFF"
};

class App extends Component {
    constructor(props) {
        super(props);
        this.cookies = new Cookies()
        this.state = {};
        this.state.history = this.cookies.get('history') || []
        this.state.chartData = this.getChartDataFromHistory()
        this.state.daily = this.state.chartData[moment(moment.now()).day()]
        this.completePomodoro = this.completePomodoro.bind(this);
        this.clearHistory = this.clearHistory.bind(this);
        this.updateCookies = this.updateCookies.bind(this);
        this.getChartDataFromHistory = this.getChartDataFromHistory.bind(this);
    }

    updateChart() {
        this.setState({chartData:this.getChartDataFromHistory()})
        this.setState({daily:this.state.chartData[moment(moment.now()).day()]})
    }


    getChartDataFromHistory() {
        let dSet = [0,0,0,0,0,0,0,0];
        for(var i = 0; i<this.state.history.length; i++){
            //get all in the past week
            let d = this.state.history[i].completeDate;
            let cDay = moment(d).day();
            console.log("DAY" + cDay);
            dSet[cDay]++;
        }
        return dSet;
    }

    completePomodoro(hist) {
        let newHistory = this.state.history.slice();
        newHistory.push(hist);
        this.setState({history: newHistory})
        this.updateChart()
        this.updateCookies()
    }

    updateCookies() {
        this.cookies.set('history', this.state.history,  {path: "/"});
    }

    clearHistory() {
        this.setState({history:[], chartData:[0,0,0,0,0,0,0], daily:0})
        this.updateCookies()
    }

    render() {
        //  <Particles className="particles"/>
        return (
            <div className="App">
                <Timer onCompleteInterval={this.completePomodoro}/>
                <div className={"charts"}>
                    <p> Today you have completed {this.state.daily} pomodoros </p>
                    <LineChart data={weekChartData(this.state.chartData)} options={coptions} width="600" height="250"/>
                </div>
                <PomodoroLog className='history' history={this.state.history}/>
                <button className="clear-history" onClick={this.clearHistory}> Clear </button>
            </div>
        );
    }
}

export default App;
