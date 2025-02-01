import PropTypes from 'prop-types';

const Card = ({ children }) => {
    return (
        <div className="flex justify-center items-center min">
            <div className="bg-dark-100 p-6 rounded-lg shadow-lg border-2 border-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-w-[24rem] max-w-[500px]">
                {children}
            </div>
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Card;