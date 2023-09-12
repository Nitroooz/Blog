import { useState, useEffect } from 'react';
import viteLogo from '/vite.svg';
import './App.css';
import { myloginWithGoogle, myLogout, activateUpdate, writeUserData } from './Firebase';

function App() {
  const [user, setUser] = useState({
    nome: 'Usuário',
    email: 'Email',
    photo: viteLogo,
  });

  const [textInput, setTextInput] = useState('');
  const [tInput, setTInput] = useState('');
  const [titlePost, setTitlePost] = useState('');
  const [posts, setPosts] = useState([{ user: "", text: "", photo: "", title: "", time: 0 }]);
  const [campoTextoVisivel, setCampoTextoVisivel] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    activateUpdate((newPosts) => {
      // Ordena os novos posts de forma decrescente
      newPosts.sort((a, b) => {
        let da = new Date(b.time),
          db = new Date(a.time);
        return da - db;
      });
      setPosts(newPosts);
    });
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  useEffect(() => {
    if (user.email && user.email !== 'Email') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  const handleCriarPostClick = () => {
    setCampoTextoVisivel(!campoTextoVisivel);
  };

  const handleEnviarClick = () => {
    if (!isLoggedIn) {
      alert("Você precisa fazer login para enviar mensagens.");
      return;
    }
    
    writeUserData(tInput, titlePost);
    setTInput('');
    setTitlePost('');
    setCampoTextoVisivel(false);
  };

  return (
    <>
      <div className='divHeader'>
        <h1 className='tLiveBlog'>Live Blog</h1>
        <div className='divUsuario'>
          <img src={user.photo} className="logo" alt="React logo" />
          <div className='divUserEmail'>
            <h1 className='tUserName' >{user.nome}</h1>
            <h2 className='tEmail'>{user.email}</h2>
          </div>
          <button className='buttonCriarPost' onClick={handleCriarPostClick}>
            Criar Post
          </button>
        </div>
        <div className="card">
          <button className="bLoginGoogle" onClick={() => myloginWithGoogle(setUser)}>
            Login com Google
          </button>
          <button className="bDeslogar" onClick={() => myLogout()}>
            Deslogar
          </button>
        </div>
      </div>
      <div className='divPosts'>
        {posts.map((post) => (
          <div className="posts" key={post.key}>
            <img className='photo' src={post.photo} alt={post.user} />
            <div className='divConteudoPosts'>
              <h2 className='tNameUser'>{post.user}:</h2>
              {post.time&&<h5 className='tHorario'>{`${(new Date(post.time)).getDate() < 10? "0"+(new Date(post.time)).getDate().toString() : (new Date(post.time)).getDate()}/${((new Date(post.time)).getMonth() + 1) < 10 ? "0" + ((new Date(post.time)).getMonth() + 1).toString() : ((new Date(post.time)).getMonth() + 1)}`} {`${(new Date(post.time)).getHours() < 10? "0"+(new Date(post.time)).getHours().toString() : (new Date(post.time)).getHours()}:${(new Date(post.time)).getMinutes() < 10? "0"+(new Date(post.time)).getMinutes().toString() : (new Date(post.time)).getMinutes()}`}</h5>}
              <div className='divConteudoPosts titleText'>
              <h2 className='tTitlePost'>{post.title ? post.title : "Sem Título"}</h2>
              <h3 className='tTextPost'>{post.text}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className='divEnviarMsg'
        style={{ display: campoTextoVisivel ? 'block' : 'none' }}>
        <div className='inputs'>
          <input
            className='input1'
            id='titlePost'
            placeholder="Digite o titulo..."
            value={titlePost}
            onChange={(event) => setTitlePost(event.target.value)}
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                handleEnviarClick();
              }
            }}
          />
          <input
            className='input1'
            id='input1'
            placeholder="Digite seu texto..."
            value={tInput}
            onChange={(event) => setTInput(event.target.value)}
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                handleEnviarClick();
              }
            }}
          />
        </div>
        <button
          className="bEnviarMsg"
          onClick={handleEnviarClick}>
          Enviar
        </button>
      </div>
    </>
  );
}

export default App;
