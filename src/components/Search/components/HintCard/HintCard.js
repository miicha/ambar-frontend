import React, { Component } from 'react'
import EmptyCard from '../EmptyCard'
import classes from './HintCard.scss'

const HintCard = (props) => {
    const { title, description } = props

    const hintText = (<div><p>Try these tips to refine your search</p>
        <ul>
            <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('*') }}>
                *
                    </span> - show all files
                </li>
            <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('John') }}>
                John
                    </span> - search for "John" word in file content, fullname, source and author
                </li>
            <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('John Smith') }}>
                John Smith
                    </span> - search for both "John" and "Smith" words in file content, fullname, source and author
                </li>
            <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('"John Smith"') }}>
                "John Smith"
                    </span> - search for "John Smith" phrase in file content, fullname, source and author
                </li>
            <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('"John Smith"~10') }}>
                "John Smith"~10
                    </span> - search for both "John" and "Smith" words with maximum distance of 10 words in file content, fullname, source and author
                </li>
            <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('John~3') }}>
                John~3
                    </span> - fuzzy search for word "John" in all files with maximum of 3 replacements
                </li>
            <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('filename:*.txt') }}>
                filename:*.txt
                    </span> - search for ".txt" in file fullname, can be combined with other queries (examples:&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('filename:*.pdf') }}>*.pdf</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('filename:*.doc*') }}>*.doc*</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('filename:*.rtf') }}>*.rtf</span>
                )
                </li>
            <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('size>1M') }}>
                size>1M
                    </span> - search for all files larger than 1 MB, can be combined with other queries (available options are:&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('size<1M') }}>size&lt;1M</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('size>100K') }}>size&gt;100K</span>
                )
                </li>
            <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:today') }}>
                when:today
                    </span> - search for all files modified today (available options are:&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:today') }}>today</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:yesterday') }}>yesterday</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:thisweek') }}>thisweek</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:thismonth') }}>thismonth</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:thisyear') }}>thisyear</span>
                )
                </li>
            <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('author:*') }}>
                author:*
                    </span> - search only in file author field, can be combined with other queries
                </li>
        </ul>
    </div>)

    const emailText = (<p>
        Have any questions? <a className={classes.link} href="mailto:hello@ambar.cloud?subject=Ambar Question">Drop us an email</a>
    </p>)

    const textElement = (<div>
        <p style={{ marginTop: 0 }}>{description}</p>
        {hintText}
        {emailText}
    </div>)

    return (
        <EmptyCard
            title={title}
            textElement={textElement} />
    )
}

HintCard.propTypes = {
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.object.isRequired
}

export default HintCard




