import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

import {
  Home,
  BlogPost
} from './screens';

import { withStyles } from '@material-ui/core/styles';

import axios from 'axios';

const styles = {
  App: {
     height: '100%',
     width: '100%',
     display: 'flex',
     flexDirection: 'column'
  },
  header: {
    height: '75px',
    backgroundColor: 'green'
    },
  footer: {
    height: '60px',
    backgroundColor: '#313238'
  },
  mainContent: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    height: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightNav: {
    width: '300px',
    height: '100%',
    backgroundColor:'green',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  bodyContent: {
    height: '100%',
    flex: 1,
    overflow: 'auto'
  },
  refresh: {
	color: 'yellow',
	fontSize: '12px',
	alignSelf: 'flex',
	margin: 5
  },
  homeLink: {
    textAlign: 'center',
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: '1.6rem',
    margin: 20
  },
  news: {
	color: 'yellow',
	marginBottom: 0
  },
  newsDiv: {
    flex: 1,
    overflow: 'auto',
    width: 'calc(100% - 40px)',
    padding: '0px 20px 20px 20px'
  },
  media: {
      height: 120,
  },
  card: {
    width: '100%',
    marginBottom: 10
  },
  copyright: {
	alignItems: 'center',
	justifyContent: 'center',
    alignItems: 'center'
  }
}

const api_key = '59055059047b4661ab34441b8c56f617'
const newsAPIUrl = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=59055059047b4661ab34441b8c56f617&pageSize=5'

let timeOutCall;

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      newsArticles:[],
      newsError: '',
      newsLoading: true,
      refreshDate: moment()
    }
  }

  componentDidMount(){
    this.updateNews();
  }

  updateNews(){
    axios.get(newsAPIUrl)
      .then( (response) => {
        // handle success
        if(response && response.data && response.data.articles){
          this.setState({
            newsArticles: response.data.articles,
            newsError: null,
            newsLoading: false,
            refreshDate: moment()
          })
        }else{
          this.setState({
            newsArticles: [],
            newsError: null,
            newsLoading: false,
            refreshDate: moment()
          })
        }
        this.setFutureApiCall();
      })
      .catch( (error) => {
        this.setState({
          newsArticles: [],
          newsError: error,
          newsLoading: false,
          refreshDate: moment()
        })
        this.setFutureApiCall();
      });
  }

  updateNewsButton() {
    axios.get(newsAPIUrl)
      .then( (response) => {
        // handle success
        if(response && response.data && response.data.articles){
		  console.log(response);
          this.setState({
            newsArticles: response.data.articles,
            newsError: null,
            newsLoading: false,
            refreshDate: moment()
          })
        }else{
          this.setState({
            newsArticles: [],
            newsError: null,
            newsLoading: false,
            refreshDate: moment()
          })
        }
      })
      .catch( (error) => {
        this.setState({
          newsArticles: [],
          newsError: error,
          newsLoading: false,
          refreshDate: moment()
        })
      });
  }

  setFutureApiCall = () => {
    timeOutCall = setTimeout(()=> {
      this.updateNews();
    }, 5000)
  }

  componentWillUnmount(){
    if(timeOutCall){
      clearTimeout(timeOutCall);
    }
  }

  onLearnMoreclicked = (link) => {
    window.open(link, '_blank');
  }

  getNewsList = () => {
    const { classes } = this.props;
    const news = [];

    for(let i=0; i<this.state.newsArticles.length; i++){
      const bPost = this.state.newsArticles[i];
	  news.push(
		<div className={classes.newsDiv}>
        <Card className={classes.card} key={i+''}>
            <CardMedia
              className={classes.media}
              image={bPost.urlToImage}
              title={bPost.title}
            />
            <CardContent>
              <Typography gutterBottom variant="body1" component="h2">
                {bPost.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {bPost.description}
              </Typography>
            </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => this.onLearnMoreclicked(bPost.url)}>
              Learn More
            </Button>
          </CardActions>
        </Card>
		</div>
      )
    }
    if(this.state.newsLoading){
      return <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CircularProgress /></div>
    }else if(this.state.newsError){
      return <p style={{'color': 'red'}}>{this.state.newsError}</p>
    }else if(news.length <= 0){
      return <p style={{textAlign: 'center'}}>No Data To Display</p>
    }else{
      return news
    }
  }

  render(){

    const { classes } = this.props;

    return (
      <div className={classes.App}>
        <Router>
          <div className={classes.header}>
			<h1 align= "center">Android graphics and midi programming</h1>
          </div>
          <div className={classes.mainContent}>
            <div className={classes.bodyContent}>
                <Switch>
                  <Route path="/blogPost/:postId">
                    <BlogPost />
                  </Route>
                  <Route path="/">
                    <Home />
                  </Route>
                </Switch>
            </div>
            <div className={classes.rightNav}>
              <Link className={classes.homeLink} to="/">Home</Link>
			  <h3 className={classes.news}>News </h3>
			  <Button variant="primary" onClick={() => this.updateNewsButton()}>Load News</Button>
			  <p className={classes.refresh}>Refreshed At: {this.state.refreshDate.format('hh:mm:ss a')}</p>
              <div className={classes.newsDiv}>
                 {this.getNewsList()}
              </div>
            </div>
          </div>
          <div className={classes.footer}>
			<h5 className={classes.copyright} align="center">Copyright * shiva</h5>
          </div>
        </Router>
      </div>
    );
  }
}

export default (withStyles(styles))(App);
