import React from 'react'

const Tweet = ( content : any) => {
    //console.log(content)
    return (
        <div className='hover:bg-[rgba(1,1,1,0.05)] border-t border-[rgba(1,1,1,0.1)]' >
            {content.content.title}
        </div>
    )

}

const UserTweets = ( userTweets : any) => {
    //console.log('hi')
    console.log(userTweets.userTweets)

  return (
    <div className=''>
        {userTweets.userTweets.map((tweet : any) => (
            <Tweet content={tweet} />
        ))}
    </div>
  )
}

export default UserTweets