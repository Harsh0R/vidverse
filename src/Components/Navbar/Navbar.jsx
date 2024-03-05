import React, { useContext, useEffect, useState } from 'react';
import { VidverseContext } from '../../Context/VidverseContext';
import { Link } from 'react-router-dom';
import { copyImg } from '../../assets/imgs';
import Style from "./Navbar.module.css";

const Navbar = () => {
  const { account, connectWallet, disconnectFromMetaMask, getBalance } = useContext(VidverseContext);
  const [currentAccount, setCurrentAccount] = useState('');
  const [active, setActive] = useState(1);
  const [balance, setBalance] = useState(0); 
  
  useEffect(() => {
    setCurrentAccount(account);
  }, [account]);

  useEffect(() => {
    if (currentAccount) {
      getBalance(currentAccount)
        .then(balance => setBalance(balance));
    }
  }, [currentAccount, getBalance]);

  // Function to copy the account address to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentAccount);
    alert("Address copied to clipboard!");
  };

  // Function to truncate the account address
  const truncatedAccount = currentAccount ? `${currentAccount.slice(0, 4)}...${currentAccount.slice(-4)}` : '';

  const menuItems = [
    { menu: "Home", link: "/" },
    { menu: "About", link: "/" },
    { menu: "My Account", link: "/myAccount" },
    { menu: "Setting", link: "/" },
    { menu: "FAQs", link: "/" },
    { menu: "Terms of Use", link: "/" },
  ];

  return (
    <div className={Style.navbar}>
      <h1 className={Style.navbarLogo}>VIDVERSE</h1>


      <div className={Style.listitem}>
        {menuItems.map((el, i) => (
          <li key={i} className={`${Style.navbarItem} ${active === i + 1 ? Style.activeItem : ''}`}>
            <Link to={el.link} onClick={() => setActive(i + 1)}>
              {el.menu}
            </Link>
          </li>
        ))}
      </div>



      <div className={Style.navbarItem}>
        {currentAccount && (
          <div className={Style.acc}>
            <span className={Style.account}>Acc Address = {truncatedAccount}</span>
            <button className={Style.copyBtn} onClick={copyToClipboard}>
              <img src={copyImg} alt="Your SVG" />
            </button>
            <span className={Style.balance}>Balance: {balance}VT</span>
          </div>
        )}
        <button className={Style.connectBtn} onClick={currentAccount ? disconnectFromMetaMask : connectWallet}>
          {currentAccount ? 'Disconnect' : 'Connect MetaMask'}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
