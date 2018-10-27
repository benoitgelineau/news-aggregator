/* eslint-disable no-shadow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { fetchArticles, resetArticles } from '../../actions/articlesActions';

import Sidebar from '../sidebar/Sidebar';
import Articles from '../articles/Articles';
import Footer from './Footer';
import styles from '../../styles/layout/Index.scss';

class Index extends Component {
  constructor() {
    super();
    this.timer = null;
  }

  componentDidMount() {
    const { match: { params: { topic } }, country, articles, fetchArticles } = this.props;
    console.log('Index mounting');

    fetchArticles(articles, country.code, topic);
    // FETCH ARTICLES EVERY MINUTE (LIMIT 1,000 REQUESTS/DAY API)
    // this.timer = setInterval(this.fetchTimer, 60000);
    // this.timer = setInterval(this.fetchTimer, 5000);
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { topic } }, country, articles, fetchArticles } = this.props;

    if (topic !== prevProps.match.params.topic || country.code !== prevProps.country.code) {
      console.log('Index updating');
      fetchArticles(articles, country.code, topic);
      // this.timer = setInterval(this.fetchTimer, 60000);
    }
  }

  componentWillUnmount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.resetArticles();
    // clearInterval(this.timer);
  }

  fetchTimer = () => {
    const { fetchArticles, articles, country, match: { params: { topic } } } = this.props;
    fetchArticles(articles, country.code, topic);
  }

  render() {
    return (
      <div className={styles.showcase}>
        <header className={styles.header}>
          <h1 className={styles.title}>Top Stories</h1>
          <p className={styles.date}>{moment(Date.now()).format('MMMM D, YYYY')}</p>
        </header>
        <Sidebar />
        <Articles />
        <Footer />
      </div>
    );
  }
}

Index.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
  country: PropTypes.instanceOf(Object).isRequired,
  articles: PropTypes.instanceOf(Array).isRequired,
  fetchArticles: PropTypes.func.isRequired,
  resetArticles: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  country: state.articles.country,
  articles: state.articles.articles,
});

export default connect(mapStateToProps, { fetchArticles, resetArticles })(Index);
