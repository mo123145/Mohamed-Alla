    // ===== PARTICLES =====
    const container = document.getElementById('particles');
    const colors = ['#7c3aed','#2563eb','#06b6d4','#a78bfa','#60a5fa'];
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${Math.random()*20+15}s;animation-delay:${Math.random()*15}s;filter:blur(${Math.random()>0.5?'1px':'0'});box-shadow:0 0 ${size*2}px currentColor;`;
      container.appendChild(p);
    }

    // ===== SKILL BARS =====
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.animation = 'none'; bar.offsetHeight;
            bar.style.animation = 'fillBar 1.5s cubic-bezier(0.4,0,0.2,1) forwards';
          });
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.section').forEach(s => observer.observe(s));

    // ===== PROJECT MODAL DATA =====
    const PROJECTS = [
      {
        emoji: '🗄️',
        title: 'نظام إدارة الطلاب',
        titleEn: 'Student Management System',
        status: 'done',
        statusText: '✓ مكتمل · Done',
        desc: 'نظام قاعدة بيانات متكامل مبني بـ C++ و SQL لإدارة بيانات الطلاب والدرجات والمواد الدراسية بشكل احترافي. يتيح النظام إضافة وتعديل وحذف بيانات الطلاب مع إمكانية استعراض التقارير الكاملة وإجراء عمليات البحث والتصفية المتقدمة.',
        features: [
          'إضافة وتعديل وحذف بيانات الطلاب بسهولة',
          'نظام تسجيل الدرجات لكل مادة على حدة',
          'تقارير إحصائية تفاعلية للأداء الأكاديمي',
          'واجهة استعلام SQL متقدمة للبحث والتصفية',
          'تصميم قاعدة بيانات متكاملة بعلاقات محكمة',
          'نظام تصدير البيانات والتقارير',
        ],
        tech: ['C++','SQL','Database Design','OOP','File I/O']
      },
      {
        emoji: '🤖',
        title: 'AI Chatbot بالعربي',
        titleEn: 'Arabic AI Chatbot',
        status: 'wip',
        statusText: '⚡ جاري · In Progress',
        desc: 'بوت دردشة ذكي يفهم ويتفاعل باللغة العربية باستخدام تقنيات معالجة اللغات الطبيعية (NLP). الهدف من المشروع هو بناء مساعد ذكي يستطيع الإجابة على الأسئلة الشائعة والتفاعل مع المستخدمين بطريقة طبيعية وسلسة باللغة العربية.',
        features: [
          'فهم وتحليل النصوص العربية بدقة عالية',
          'الرد التلقائي على الأسئلة الشائعة',
          'معالجة اللغة الطبيعية NLP للغة العربية',
          'قاعدة معرفة قابلة للتوسع والتحديث',
          'دعم السياق والمحادثات المتعددة الأدوار',
          'واجهة برمجية API للتكامل مع التطبيقات',
        ],
        tech: ['Python','NLP','Machine Learning','NLTK','AI','Arabic Processing']
      },
      {
        emoji: '🌐',
        title: 'Portfolio Website',
        titleEn: 'Personal Portfolio Website',
        status: 'done',
        statusText: '✓ مكتمل · Done',
        desc: 'موقع شخصي احترافي يعرض مهاراتي ومشاريعي وخبراتي بتصميم عصري Dark Mode مع تأثيرات بصرية متقدمة. يشمل الموقع نظام Glassmorphism وحركات Animations سلسة وتجربة مستخدم مميزة تعكس مهاراتي في تطوير الويب.',
        features: [
          'تصميم Dark Mode عصري مع Glassmorphism',
          'جسيمات متحركة وخلفية ديناميكية',
          'شريط تقدم متحرك للمهارات التقنية',
          'نظام AI Chatbot تفاعلي مدمج',
          'تصميم Responsive لكل الأجهزة',
          'قسم مشاريع مع موديل تفاصيل كاملة',
        ],
        tech: ['HTML5','CSS3','JavaScript','Animations','Responsive Design','AI Integration']
      }
    ];

    function openProject(index) {
      window.location.href = `project.html?id=${index}#project-${index}`;
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeProject();
    });

    function closeProject() {
      document.getElementById('projModal').classList.remove('open');
      document.body.style.overflow = '';
    }

    function closeProjOnOverlay(e) {
      if (e.target === document.getElementById('projModal')) closeProject();
    }
