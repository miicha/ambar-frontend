import React from 'react'
import ReactDOM from 'react-dom'
import deepEqual from 'deep-equal'
import { bindMethods } from './bindMethods.js'

const topPosition = (domElt) => {
  if (!domElt) {
    return 0
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent)
}

export default class InfiniteScroll extends React.Component {
  constructor(props) {
    super(props)
    bindMethods(this, ['scrollListener', 'attachScrollListener', 'detachScrollListener'])
  }

  componentDidMount() {
    this.attachScrollListener()
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props.children, nextProps.children)
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  render() {
    return React.DOM.div(null, this.props.children)
  }

  scrollListener() {
    const { fetching, hasMore, currentPage } = this.props
    let el = ReactDOM.findDOMNode(this);
    let scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {      
      {!fetching && hasMore && this.props.loadMore(currentPage + 1)}
    }
  }

  attachScrollListener() {
    window.addEventListener('scroll', this.scrollListener)
    window.addEventListener('resize', this.scrollListener)
    this.scrollListener();
  }

  detachScrollListener() {
    window.removeEventListener('scroll', this.scrollListener)
    window.removeEventListener('resize', this.scrollListener)
  }
}

InfiniteScroll.defaultProps = {
  currentPage: 0,
  hasMore: true,
  threshold: 250
};

InfiniteScroll.PropTypes = {
  currentPage: React.PropTypes.number.isRequired, 
  fetching: React.PropTypes.bool.isRequired,
  hasMore: React.PropTypes.bool,
  loadMore: React.PropTypes.func.isRequired,
  threshold: React.PropTypes.number
};