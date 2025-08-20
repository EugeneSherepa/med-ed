import './BreakLine.scss';

export const BreakLine = ({ dpt = 94, dpb = 172, title, text }) => {
  return (
    <div
      style={{
        '--dpt': `${dpt}px`,
        '--dpb': `${dpb}px`,
      }}
      className={title ? 'breakline breakline-background-wrapper' : 'breakline'}
    >
      <div className="breakline-backrgound">
        <div className="page-width">
          {title && text ? (
            <div className="breakline-wrapper">
              <h1 className="breakline-wrapper-title">{title}</h1>
              <div
                className="breakline-wrapper-text"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          ) : (
            <h2 className="breakline-title">
              Молоді, амбітні, орієнтовані на результат
              <br />
              ми знаємо, що потрібно для успішної підготовки до КРОК
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};
