const API_URL = "https://script.google.com/macros/s/AKfycbxo1s0Z2mdimJe9B9eA0OWTNRKQTtwEZDfaKoIjQMZEEbBTSsS5w8lFXhEnux35qNMI/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        let students = await response.json();

        if (!students || students.length === 0) return;

        // تعديل ذكي: إذا تبدلت الخانات من السيرفر، يتم تصحيحها هنا فوراً
        students = students.map(student => {
            let actualName = student.name;
            let actualScore = student.score;

            // لو خانة الاسم تحتوي على أرقام أو علامة / وخانة الدرجة هي النص، نقوم بعكسهم
            if (student.name.includes('/') || !isNaN(student.name.trim())) {
                actualName = student.score;
                actualScore = student.name;
            }

            return {
                name: actualName.toString().trim(),
                score: actualScore.toString().trim()
            };
        });

        // 1. ترتيب تنازلي حقيقي بناءً على الرقم الأول في الدرجة
        students.sort((a, b) => {
            let scoreA = parseInt(a.score.split('/')[0]) || 0;
            let scoreB = parseInt(b.score.split('/')[0]) || 0;
            return scoreB - scoreA;
        });

        // 2. تثبيت الطالبة جنا عمرو (Janah Amr) في المقدمة دائماً
        students.sort((a, b) => {
            let nameA = a.name.toLowerCase();
            let nameB = b.name.toLowerCase();
            if (nameA.includes("جنا عمرو") || nameA.includes("janah amr")) return -1;
            if (nameB.includes("جنا عمرو") || nameB.includes("janah amr")) return 1;
            return 0;
        });

        // 3. تحديث كروت المراكز الأولى الثلاثة
        if (students.length >= 1) {
            document.getElementById("firstName").textContent = students[0].name;
            document.getElementById("firstScore").textContent = students[0].score;
        }
        if (students.length >= 2) {
            document.getElementById("secondName").textContent = students[1].name;
            document.getElementById("secondScore").textContent = students[1].score;
        }
        if (students.length >= 3) {
            document.getElementById("thirdName").textContent = students[2].name;
            document.getElementById("thirdScore").textContent = students[2].score;
        }

        // 4. بناء الجدول بالشكل الصحيح
        const tableBody = document.getElementById("tableBody");
        if (tableBody) {
            tableBody.innerHTML = "";
            students.forEach((student, index) => {
                tableBody.innerHTML += `
                    <tr>
                        <td><span class="rank-badge">${index + 1}</span></td>
                        <td style="font-weight: 600;">${student.name}</td>
                        <td style="color: #ffd700; font-weight: bold;">${student.score}</td>
                    </tr>
                `;
            });
        }

    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// كود البحث الفوري
const searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase().trim();
        document.querySelectorAll("#tableBody tr").forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
        });
    });
}

loadData();
setInterval(loadData, 60000);
