import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import backgroundImage from '../assets/img/background/background main v2.png';

// Import item images
import beerImg from '../assets/img/item/Beer .png';
import bulletImg from '../assets/img/item/bullet.png';
import chainsawImg from '../assets/img/item/chainsaw.png';
import glassImg from '../assets/img/item/glass.png';
import handcuffsImg from '../assets/img/item/còng tay.jpg';
import viewfinderImg from '../assets/img/item/solo.jpg';
import vegerateImg from '../assets/img/item/vigerate.png';
import mainUIImg from '../assets/img/UI/Main_UI.png';

export default function GuidePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('name') || 'Player';

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100;
    setScrollProgress(Math.min(scrollPercentage, 100));
  };

  const handleEnterLobby = () => {
    navigate(`/lobby?name=${encodeURIComponent(playerName)}`);
  };

  const itemGuides = [
    {
      name: 'Bia (Beer)',
      image: beerImg,
      description: 'Rút viên đạn tiếp theo ra khỏi súng',
      usage: 'Sử dụng để bỏ qua một viên đạn không mong muốn'
    },
    {
      name: 'Đạn (Bullet)',
      image: bulletImg,
      description: 'Thêm 1 viên đạn ngẫu nhiên vào súng',
      usage: 'Sử dụng để tăng số lượng đạn trong súng'
    },
    {
      name: 'Cưa (Chainsaw)',
      image: chainsawImg,
      description: 'Sát thương x2 cho lần bắn tiếp theo',
      usage: 'Sử dụng khi muốn gây sát thương lớn'
    },
    {
      name: 'Thuốc lá (Cigarette)',
      image: vegerateImg,
      description: 'Hồi phục 1 điểm máu',
      usage: 'Sử dụng khi máu thấp'
    },
    {
      name: 'Kính (Glass)',
      image: glassImg,
      description: 'Xem viên đạn tiếp theo là thật hay giả',
      usage: 'Sử dụng để xem đạn tiếp theo trước khi bắn'
    },
    {
      name: 'Còng tay (Handcuffs)',
      image: handcuffsImg,
      description: 'Khóa 1 đối thủ được chọn',
      usage: 'Sử dụng để buộc một đối thủ bỏ qua lượt'
    },
    {
      name: 'Go solo',
      image: viewfinderImg,
      description: 'Kéo 1 người vào solo. Solo kết thúc khi 1 người bị mất máu. Người thắng được +1 HP. Tự bắn mình sẽ không mất máu.',
      usage: 'Sử dụng để bắt đầu một cuộc solo với đối thủ'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1
      }}></div>

      {/* Main Container */}
      <div style={{
        background: '#111827',
        borderRadius: '16px',
        border: '2px solid #991b1b',
        position: 'relative',
        zIndex: 2,
        width: '98%',
        maxWidth: '1400px',
        height: '90vh',
        maxHeight: '900px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 40px',
          borderBottom: '2px solid #374151',
          textAlign: 'center',
          background: 'rgba(31, 41, 55, 0.8)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#ef4444',
            marginBottom: '5px',
            letterSpacing: '2px'
          }}>
            HƯỚNG DẪN TRÒ CHƠI
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>
            Chào mừng, {playerName}! Hãy đọc hướng dẫn đầy đủ trước khi chơi.
          </p>
        </div>

        {/* Scrollable Content Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '70px 80px',
            color: 'white',
            fontSize: '20px',
            lineHeight: '2.2',
            scrollBehavior: 'smooth'
          }}
          onScroll={handleScroll}
        >
          {/* Section 0: Giới thiệu Trang Guide */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
              border: '2px solid #7c3aed',
              borderRadius: '16px',
              padding: '40px',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '34px',
                fontWeight: 'bold',
                color: '#a78bfa',
                marginBottom: '20px',
                letterSpacing: '1px'
              }}>
                🎮 Chào Mừng Đến Buckshot Roulette
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#e5e7eb',
                marginBottom: '20px',
                lineHeight: '1.8'
              }}>
                Trang hướng dẫn này sẽ giúp bạn hiểu rõ về luật chơi, cách sử dụng các vật phẩm, và những mẹo chiến lược để chiến thắng.
                Hãy đọc kỹ từng phần để trở thành một người chơi thực thụ!
              </p>

              {/* Note about resolution */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)',
                border: '2px solid #fb923c',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '25px',
                textAlign: 'left'
              }}>
                <p style={{
                  fontSize: '16px',
                  color: '#fbbf24',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📌 LƯU Ý QUAN TRỌNG:
                </p>
                <p style={{
                  fontSize: '15px',
                  color: '#fed7aa',
                  marginBottom: '8px',
                  lineHeight: '1.6'
                }}>
                  Nếu độ phân giải màn hình của bạn nhỏ hơn <strong>2K (2560x1440)</strong>, hãy
                  <strong style={{ color: '#fbbf24' }}> giảm tỷ lệ zoom xuống 80%</strong> trên trình duyệt để có trải nghiệm giao diện tốt nhất.
                  Bạn có thể sử dụng các phím tắt sau:
                </p>
                <ul style={{
                  fontSize: '14px',
                  color: '#fcd34d',
                  marginLeft: '20px',
                  marginTop: '10px',
                  marginBottom: '0'
                }}>
                  <li><strong>Windows/Linux:</strong> Ctrl + Minus (−) hoặc Ctrl + Wheel Down</li>
                  <li><strong>Mac:</strong> Cmd + Minus (−) hoặc Cmd + Wheel Down</li>
                  <li><strong>Reset zoom:</strong> Ctrl + 0 (Windows/Linux) hoặc Cmd + 0 (Mac)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 1: Giới thiệu */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '20px',
              borderBottom: '3px solid #fbbf24',
              paddingBottom: '15px',
              textAlign: 'center'
            }}>
              Giới thiệu
            </h2>
            <div style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
              border: '2px solid #fbbf24',
              borderRadius: '12px',
              padding: '30px',
              marginBottom: '20px'
            }}>
              <p style={{ marginBottom: '15px', fontSize: '18px', lineHeight: '1.8' }}>
                <strong style={{ fontSize: '20px', color: '#fbbf24' }}>Buckshot Roulette</strong> là một trò chơi bắn súng chiến lược dành cho <strong style={{ color: '#60a5fa' }}>2-4 người chơi</strong>. Mục tiêu của bạn là
                <strong style={{ color: '#22c55e', fontSize: '18px' }}> sống sót</strong> lâu hơn những người chơi khác và trở thành <strong style={{ color: '#fbbf24', fontSize: '18px' }}>người chiến thắng</strong> cuối cùng.
              </p>
              <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
                Trò chơi kết thúc khi chỉ còn <strong style={{ color: '#22c55e' }}>1 người chơi có máu (HP)</strong> sẽ giành chiến thắng. Máu ban đầu là <strong style={{ color: '#ef4444' }}>5 điểm</strong> và tối đa là <strong style={{ color: '#ef4444' }}>6 điểm</strong>.
              </p>
            </div>
          </section>

          {/* Section 2: Giao diện trò chơi */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '25px',
              borderBottom: '3px solid #374151',
              paddingBottom: '15px'
            }}>
              Giao diện Trò Chơi
            </h2>
            <div style={{ background: 'rgba(99, 71, 255, 0.1)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>Avatar & Máu (HP):</strong> Ở các góc của màn hình, hiển thị avatar và máu còn lại của mỗi người chơi. Máu được biểu thị bằng các chỉ báo đỏ.
              </p>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>Hiệu ứng (Effect):</strong> Bên cạnh HP, có các ô hiệu ứng hiển thị trạng thái của người chơi. Các hiệu ứng bao gồm:
                <ul style={{ marginLeft: '20px', marginTop: '8px', marginBottom: '10px', fontSize: '18px' }}>
                  <li><strong>Bị còng tay:</strong> Người chơi bị khóa và sẽ bỏ qua lượt tiếp theo</li>
                  <li><strong>Đang solo:</strong> Người chơi đang trong cuộc solo với một đối thủ khác</li>
                </ul>
              </p>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>Súng:</strong> Ở giữa màn hình, hiển thị súng sẽ xoay để hướng đến mục tiêu của bạn.
              </p>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>Đạn (Ammo):</strong> Phía dưới súng hiển thị số lượng đạn thật (đỏ) và đạn giả (xanh) còn lại trong suốt trò chơi.
              </p>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>Vật phẩm (Items):</strong> Ở phía dưới, chỉ hiện tối đa 7 vật phẩm. Nhấn vào item để sử dụng.
              </p>
              <p style={{ fontSize: '18px' }}>
                <strong>Nhật ký hành động:</strong> Ở góc trái, hiển thị thông báo hành động gần đây. Hover vào để xem lịch sử 10 thông báo gần nhất.
              </p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <img
                src={mainUIImg}
                alt="Main Game UI"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '2px solid #374151',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </section>

          {/* Section 3: Luật chơi */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '25px',
              borderBottom: '3px solid #374151',
              paddingBottom: '15px'
            }}>
              Luật Chơi
            </h2>
            <div style={{ background: 'rgba(99, 71, 255, 0.1)', padding: '20px', borderRadius: '8px' }}>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>1. Lượt chơi:</strong> Mỗi lượt, người chơi hiện tại có thể <strong>bắn</strong> một đối thủ hoặc <strong>sử dụng</strong> một vật phẩm.
              </p>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>2. Bắn súng:</strong> Khi bạn bắn, súng sẽ ngẫu nhiên bắn một viên đạn:
                <ul style={{ marginLeft: '20px', marginTop: '8px', fontSize: '18px' }}>
                  <li><strong style={{ color: '#ef4444' }}>Đạn thật (đỏ):</strong> Gây 1 sát thương cho đối thủ (mất 1 điểm máu)</li>
                  <li><strong style={{ color: '#22c55e' }}>Đạn giả (xanh):</strong> Không gây sát thương, nhưng bạn mất lượt</li>
                </ul>
              </p>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>3. Hiệu ứng đặc biệt:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '8px', fontSize: '18px' }}>
                  <li><strong style={{ color: '#fbbf24' }}>Solo:</strong> Nếu bắn đạn thật vào bản thân, bạn không mất máu nhưng được thêm 1 lượt chơi liên tiếp.</li>
                  <li><strong style={{ color: '#6347ff' }}>Bị khóa:</strong> Nếu bị Còng tay từ đối thủ, bạn sẽ bỏ qua lượt tiếp theo.</li>
                </ul>
              </p>
              <p style={{ fontSize: '18px' }}>
                <strong>4. Kết thúc:</strong> Khi chỉ còn 1 người có máu lớn hơn 0, họ là người chiến thắng.
              </p>
            </div>
          </section>

          {/* Section 4: Cách chơi */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '25px',
              borderBottom: '3px solid #374151',
              paddingBottom: '15px'
            }}>
              Cách Chơi
            </h2>
            <div style={{ background: 'rgba(99, 71, 255, 0.1)', padding: '20px', borderRadius: '8px' }}>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>1. Chọn mục tiêu:</strong> Nhấp vào một đối thủ để chọn họ làm mục tiêu. Súng sẽ tự động xoay hướng về phía người chơi đó.
              </p>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>2. Chọn hành động:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '8px', fontSize: '18px' }}>
                  <li>Nhấn nút <strong style={{ color: '#ef4444' }}>bắn</strong> để bắn vào mục tiêu đã chọn</li>
                  <li>Nhấn vào một item để sử dụng nó trước khi bắn</li>
                </ul>
              </p>
              <p style={{ marginBottom: '12px', fontSize: '18px' }}>
                <strong>3. Kết quả:</strong> Hệ thống sẽ hiển thị kết quả bắn (thật hay giả), ai bị sát thương, và ai có lượt tiếp theo.
              </p>
              <p style={{ fontSize: '18px' }}>
                <strong>4. Chiến lược:</strong> Sử dụng items thông minh để lên kế hoạch, bảo vệ bản thân, hoặc gây sát thương nhiều hơn.
              </p>
            </div>
          </section>

          {/* Section 5: Chi tiết Items */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '25px',
              borderBottom: '3px solid #374151',
              paddingBottom: '15px'
            }}>
              Tác dụng Các Vật Phẩm
            </h2>
            <p style={{ marginBottom: '20px', color: '#d1d5db' }}>
              Mỗi item có tác dụng khác nhau. Sử dụng chúng một cách chiến lược để tăng cơ hội chiến thắng:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              {itemGuides.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    padding: '15px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 71, 255, 0.15)';
                    e.currentTarget.style.borderColor = '#6347ff';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = '#374151';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <h4 style={{
                    color: '#fbbf24',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    textAlign: 'center'
                  }}>
                    {item.name}
                  </h4>
                  <p style={{
                    fontSize: '13px',
                    color: '#d1d5db',
                    marginBottom: '8px',
                    minHeight: '36px'
                  }}>
                    <strong style={{ color: '#a8e6cf' }}>Tác dụng:</strong> {item.description}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    fontStyle: 'italic'
                  }}>
                    {item.usage}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Mẹo & Chiến lược */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '25px',
              borderBottom: '3px solid #374151',
              paddingBottom: '15px'
            }}>
              Mẹo & Chiến Lược
            </h2>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '20px', borderRadius: '8px', borderLeft: '3px solid #22c55e' }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px', fontSize: '16px' }}>
                  <strong>Sử dụng Kính (Glass):</strong> Xem viên đạn tiếp theo là thật hay giả để quyết định có nên bắn hay không.
                </li>
                <li style={{ marginBottom: '12px', fontSize: '16px' }}>
                  <strong>Sử dụng Bia (Beer):</strong> Rút viên đạn tiếp theo ra để tránh đạn giả hoặc đạn thật không mong muốn.
                </li>
                <li style={{ marginBottom: '12px', fontSize: '16px' }}>
                  <strong>Sử dụng Đạn (Bullet):</strong> Thêm đạn ngẫu nhiên để tăng cơ hội bắn trúng hoặc tạo rủi ro cho đối thủ.
                </li>
                <li style={{ marginBottom: '12px', fontSize: '16px' }}>
                  <strong>Sử dụng Cưa (Chainsaw):</strong> Tích lũy sát thương x2 khi máu đối thủ còn cao để gây sát thương lớn hơn.
                </li>
                <li style={{ marginBottom: '12px', fontSize: '16px' }}>
                  <strong>Bảo vệ bản thân:</strong> Nếu máu thấp, ưu tiên sử dụng Thuốc lá để hồi phục thay vì bắn.
                </li>
                <li style={{ fontSize: '16px' }}>
                  <strong>Khóa đối thủ mạnh:</strong> Sử dụng Còng tay để buộc một đối thủ mạnh bỏ qua lượt của họ.
                </li>
              </ul>
            </div>
          </section>

          {/* Bottom spacing */}
          <div style={{ height: '20px' }}></div>
        </div>

        {/* Footer with Progress Bar and Button */}
        <div style={{
          borderTop: '2px solid #374151',
          padding: '15px 40px',
          background: 'rgba(31, 41, 55, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '4px',
            background: '#374151',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #6347ff, #fbbf24)',
                width: `${scrollProgress}%`,
                transition: 'width 0.2s ease'
              }}
            />
          </div>

          {/* Info & Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '13px',
              margin: 0
            }}>
              {scrollProgress < 90
                ? `Hãy kéo xuống để hoàn thành hướng dẫn (${Math.round(scrollProgress)}%)`
                : '✅ Bạn đã sẵn sàng! Nhấn OK để vào lobby.'}
            </p>
            <button
              onClick={handleEnterLobby}
              disabled={scrollProgress < 90}
              style={{
                padding: '10px 25px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                border: 'none',
                background: scrollProgress >= 90 ? '#22c55e' : '#4b5563',
                color: 'white',
                cursor: scrollProgress >= 90 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (scrollProgress >= 90) {
                  e.currentTarget.style.background = '#16a34a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (scrollProgress >= 90) {
                  e.currentTarget.style.background = '#22c55e';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <span>VÀO LOBBY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

