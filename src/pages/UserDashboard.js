import React from 'react'
import { Link } from 'react-router-dom'
import API from '../adapters/API'

import ExhibitionCard from '../components/ExhibitionCard';
//import LoadingComponent from '../components/LoadingComponent';

class UserDashboard extends React.Component {
    state = {
        user: null,
        isSelf: false,
        match: null
    }

    componentDidMount() {
            this.setState({
                match: JSON.parse(this.props.match.params.id)
            })
    }

    componentDidUpdate(prevProps) {
        if (this.props.user && prevProps.user !== this.props.user && this.state.match === this.props.user.id) {
            this.setState({
                user: this.props.user,
                isSelf: true
            })
        } else if (this.props.user && prevProps.user !== this.props.user && this.state.match !== this.props.user.id) {
            API.getUser(this.state.match).then(user => this.setState({ user: user }) )
        //     this.props.history.push("/signin")
        }
    }
 
    render(){
        if (this.props.user === null) return null; // loading, not auth'd
        //if (this.state.user === null) return <LoadingComponent />
        // this.props.history.push("/signin");
        return(
            <article>
                {this.props.user.first_name === null || this.props.user.first_name === "" ? <span className="callout">⬇We don't know your name yet  </span> : null}<br />
                <UserDashboardOptions user={this.props.user} /><br />
                <h1 id="logo">Welcome {this.props.user.first_name}</h1>
                <br />
                {/* <p>followers/following</p> */}
                <p>You're following <strong>{this.props.user.followed_users.length}</strong></p>
                {this.props.user.followed_users.map(user=> <Following user={user} />)}
            
                <p><strong>{this.props.user.follower_users.length}</strong> Following you</p>
                {this.props.user.follower_users.map(user=> <Following user={user} />)}

                <hr />
                <h4>my art world</h4>
                {this.props.user.followed_users.length > 0 ? <UserArtWorldFeed followed_users={this.props.user.followed_users} /> : <p>Follow users to see what's new</p>}

                <hr />
                <h4>my liked shows</h4>
                <aside>
                <div className="exhibition-container">
                {/* {this.props.user.exhibition_likes.length !== 0 ? this.props.user.exhibition_likes.map(liked=> <ExhibitionCard exhibition={liked.exhibition} key={liked.exhibition.id} /> ) : "You don't currently like any exhibitions"} */}
                {this.props.user.exhibition_likes.length !== 0 ? this.props.user.exhibition_likes.map(liked=> <ExhibitionCard exhibition={liked.exhibition} key={liked.exhibition.id} /> ) : "No liked exhibitions"}
                </div>
                </aside>
                <hr />
                <h4>my curated shows</h4>
                <aside>
                <div className="exhibition-container">
                {/* {this.props.user.exhibitions.length !== 0 ? this.props.user.exhibitions.map(exhibition=> <ExhibitionCard exhibition={exhibition} key={exhibition.id} /> ) : "You haven't curated any exhibitions"} */}
                {this.props.user.exhibitions.length !== 0 ? this.props.user.exhibitions.map(exhibition=> <ExhibitionCard exhibition={exhibition} key={exhibition.id} /> ) : "No curated exhibitions"}
                </div></aside>
                
                <hr />
            </article>
        )
    }
}

export default UserDashboard

// If it's you who is logged in:

const UserDashboardOptions = (props) => {
    return(
        <>
            <Link to={{pathname: `/users/${props.user.id}/edit`}}>Edit your profile</Link>
            &nbsp;|&nbsp;
            <Link to={{pathname: `/users/public/${props.user.id}`}}>See your public profile</Link>
 
        </>
    )
}

const Following = props => {
    return(
        <Link className="relationship" to={{pathname: `/users/public/${props.user.id}`}} >{props.user.first_name !== null ? props.user.first_name : props.user.email}</Link>
    )
}


const UserArtWorldFeed = props => {

    return(
        <>
        {props.followed_users.map(user => <UserArtWorldCard user={user} />)}
        </>
    )
}

const UserArtWorldCard = props => {
    let lastExhibition = props.user.exhibitions[props.user.exhibitions.length-1]
    if (lastExhibition === undefined) return null
    return(
        <>
        <h4>✏ <Link to={{pathname: `/users/public/${props.user.id}`}}>{props.user.first_name}</Link> just curated <Link to={{pathname: `/exhibitions/${lastExhibition.id}`}} >{lastExhibition.title}</Link></h4><em>{lastExhibition.summary}</em>
        
        </>
    )
}

