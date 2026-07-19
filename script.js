// الرابط الجديد الفعال والمحدث الخاص بك
const API_URL = "https://script.google.com/macros/s/AKfycbxo1s0Z2mdimJe9B9eA0OWTNRKQTtwEZDfaKoIjQMZEEbBTSsS5w8lFXhEnux35qNMI/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        let students = await response.json();

        if (!students || students.length === 0) return;

        // 1. ترتيب الطلاب بناءً على استخراج الرقم الأول من نص الدرجة (مثل 30 من 30 / 30) لضمان الترتيب التنازلي الصحيح
        students.sort((a, b) => {
            let scoreA = parseInt(a.score.split('/')[0]) || 0;
            let scoreB = parseInt(b.score.split('/')[0]) || 0;
            return scoreB - scoreA;
        });

        // 2. استثناء خاص: تقديم الطالبة جنا عمرو (Janah Amr) في أول القائمة دائماً بناءً على طلبك
        students.sort((a, b) => {
            let nameA = a.name.toLowerCase();
            let nameB = b.name.toLowerCase();
            if (nameA.includes("جنا عمرو") || nameA.includes("janah amr")) return -1;
            if (nameB.includes("جنا عمرو") || nameB.includes("janah amr")) return 1;
            return 0;
        });

        // 3. تحديث منصة الأوائل (الثلاثة الأوائل) بالأسماء والدرجات الصحيحة في مكانها
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

        // 4. بناء جدول درجات الطلاب بالكامل بشكل صحيح
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

// كود البحث الفوري الذكي داخل الجدول
const searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase().trim();
        document.querySelectorAll("#tableBody tr").forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
        });
    });
}

// تشغيل فوري تلقائي وتحديث كل دقيقة لمزامنة الدرجات
loadData();
setInterval(loadData, 60000);
