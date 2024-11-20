import './newPrompt.css'

const NewPrompt = () => {
  return (
    <div className='newPrompt'>
        <div className="newForm">
            <label htmlFor="file">
                <img src="/attachment.png" alt="" />
            </label>
            <input id="file" type= "file" multiple={false} hidden />
            <input type="text" placeholder="Type a message"/>
            <button>
                <img src="/arrow.png" alt="" />
            </button>
        </div>
    </div>
  )
}

export default NewPrompt