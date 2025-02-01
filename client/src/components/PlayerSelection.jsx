import PropTypes from 'prop-types';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function PlayerSelection({ users, player1, setPlayer1, player2, setPlayer2 }) {
    return (
      <div className="relative h-[200px] w-full space-y-4 bg-dark-100">
        <div className='relative w-full h-12 z-50'>
        <input
          type="text"
          placeholder="Player 1 Name"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="w-full p-2 border rounded-md text-white"
        />
        <Menu as="div" className="absolute w-20 -right-10 top-0.5">
          <MenuButton className="w-full p-2 bg-transparent rounded-md text-white flex items-center justify-between">
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </MenuButton>
          <MenuItems 
          transition 
          className="absolute w-48 mt-1 right-10 bg-dark-100 border rounded-md text-white origin-top transition duration-200 focus:outline-hidden ease-out data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            {users.map((user) => (
              <MenuItem key={user._id}>
                {({ open }) => (
                  <button
                    onClick={() => setPlayer1(user.name)}
                    className={`block w-full text-left px-4 py-2 text-sm ${open ? 'bg-gray-700' : 'bg-dark-100 rounded-2xl'} focus:outline-none`}
                  >
                    {user.name}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
        </div>
        <div className='relative w-full h-20 z-20'>
        <input
          type="text"
          placeholder="Player 2 Name"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="w-full p-2 border rounded-md text-white"
        />
        <Menu as="div" className="absolute w-20 -right-10 top-0.5">
          <MenuButton className="w-full p-2 bg-transparent rounded-md text-white flex items-center justify-between">
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </MenuButton>
          <MenuItems 
          transition 
          className="absolute w-48 mt-1 right-10 bg-dark-100 border rounded-md text-white origin-top transition duration-200 focus:outline-hidden ease-out data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            {users.map((user) => (
              <MenuItem key={user._id}>
                {({ open }) => (
                  <button
                    onClick={() => setPlayer2(user.name)}
                    className={`block w-full text-left px-4 py-2 text-sm ${open ? 'bg-gray-700' : 'bg-dark-100 rounded-2xl'} focus:outline-none`}
                  >
                    {user.name}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
        </div>
      </div>
    );
  }
  
  PlayerSelection.propTypes = {
    users: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    player1: PropTypes.string.isRequired,
    setPlayer1: PropTypes.func.isRequired,
    player2: PropTypes.string.isRequired,
    setPlayer2: PropTypes.func.isRequired,
  };
  
  export default PlayerSelection;