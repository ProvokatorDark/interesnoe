window.ee = new EventEmitter();
var my_news = [
    {
        author: "Антон Пасечкин",
        text: "В четверг четвертого числа я вышел из лесу",
        bigText: "В четверг четвертого числа я вышел из лесу и обалдел. Немцы были в деревне. Я пошел обратно в партизанский отряд"
    },
    {
        author: "Василий Чапаев",
        text: "И тогда перекрестным огнем мы прижали белых к земле",
        bigText: "И тогда перекрестным огнем мы прижали белых к земле. Но они начали рыть туннель и убежали в Монголию"
    },
    {
        author: "Билли Миллиган",
        text: "Под моим командованием визиготы свергли римлян",
        bigText: "Под моим командованием визиготы свергли римлян. Чистое зло и квинтессенция добра, ищи мой booking телефон среди оккультных пентаграм"
    }
];
var Add = React.createClass({
    getInitialState: function () {
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true
        };
    },
    componentDidMount: function () {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },

    buttonClick: function (e) {
        e.preventDefault();
        var avtor = ReactDOM.findDOMNode(this.refs.author).value;
        var textEl = ReactDOM.findDOMNode(this.refs.text);
        var text = textEl.value;
        console.log(avtor);
        console.log(text);

        var item = [{
            author: avtor,
            text: text,
            bigText: '...'
        }];
        window.ee.emit('News.add', item);
        textEl.value='';
        this.setState({textIsEmpty:true});
    },
    onCheckRuleClick: function (e) {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    },
    onFieldChange: function (fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({['' + fieldName]: false})
        }
        else {
            this.setState({['' + fieldName]: true})
        }
    },

    render: function () {
        var agreeNotChecked = this.state.agreeNotChecked;
        var authorIsEmpty = this.state.authorIsEmpty;
        var textIsEmpty = this.state.textIsEmpty;
        // console.log('authorIsEmpty '+authorIsEmpty);
        // console.log('textIsEmpty '+textIsEmpty);
        // console.log('agreeNotChecked '+agreeNotChecked);
        return (
            <form className="add cf">
                <input
                    type="text"
                    className="add-author"
                    defaultValue=''
                    placeholder="Ваше имя"
                    ref='author'
                    onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
                ></input>
                <textarea
                    className="add_text"
                    defaultValue=''
                    placeholder='Текст новости'
                    ref='text'
                    onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                >
                </textarea>
                <label className="add_checkrule">
                    <input type="checkbox"
                           ref='checkrule'
                           onChange={this.onCheckRuleClick}
                    />Я согласен с правилами
                </label>
                <button
                    className="add_btn"
                    onClick={this.buttonClick}
                    ref='alert_button'
                    disabled={agreeNotChecked || textIsEmpty || authorIsEmpty}
                >Добавить новость
                </button>
            </form>
        );
    }
});

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function () {
        return {
            visible: false
        };
    },
    readMoreClick: function (e) {
        e.preventDefault();
        this.setState({visible: true});
    },

    render: function () {
        var author = this.props.data.author;
        var text = this.props.data.text;
        var bigText = this.props.data.bigText;
        var visible = this.state.visible;
        return (
            <div className="article">
                <p className="news_author">{author}</p>
                <p className="news_text">{text}</p>
                <a href="#"
                   onClick={this.readMoreClick}
                   className={'news_readmore ' + (visible ? 'none' : '')}>
                    Подробнее
                </a>
                <p className={'news_big-text ' + (visible ? '' : 'none')}>{bigText}</p>

            </div>
        );
    }
})
var News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    getInitialState: function () {
        return {
            counter: 0
        }
    },
    render: function () {
        var data = this.props.data;
        var newsTemplate;
        if (data.length > 0) {
            newsTemplate = data.map(function (item, index) {
                return (
                    <div key={index}>
                        <Article data={item}></Article>
                    </div>
                );
            })
        } else {
            newsTemplate = <p>К сожалению новостей нет</p>
        }

        return (
            <div className="news">
                {newsTemplate}
                <strong className={"news_count " + (data.length > 0 ? '' : 'none')}>
                    Всего новостей:{data.length}
                </strong>
            </div>
        );
    }
})
var App = React.createClass({
    getInitialState: function () {
        return {
            news: my_news
        };
    },
    componentDidMount: function () {
        var self = this;
        window.ee.addListener('News.add',function (item) {
           var nextNews = item.concat(self.state.news);
           self.setState({news:nextNews});
        });
    },
    componentWillUnmount: function () {
        window.ee.removeListener('News.add');
    },
    render: function () {
        console.log('render');

        return (
            <div className="app">
                <Add/>
                <h3>Новости</h3>
                <News data={this.state.news}/>
            </div>
        );
    }
});

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

