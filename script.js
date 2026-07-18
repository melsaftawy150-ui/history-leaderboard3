// الرابط الصحيح الخاص بك 100%
const API_URL = "https://script.google.com/macros/s/AKfycbyTGWbMNgZ5BslCRV-viQ89fen9Gj6AKKF4a9lqcV_MuIN9QrEO-TlSC0BqEHK6uprz/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        const data = await response.json();

        const tableBody = document.getElementById("tableBody");
        if (!tableBody) return;
        tableBody.innerHTML = "";

        // عرض قائمة الطلاب في الجدول
        data.forEach((student) => {
            // جلب القيم بأي مسمى كانت (rank أو الترتيب، name أو الاسم، score أو الدرجة)
            let rank = student.rank || student["الترتيب"] || "";
            let name = student.name || student["الاسم"] || "";
            let score = student.score !== undefined ? student.score : (student["الدرجة"] || 0);

            tableBody.innerHTML += `
                <tr>
                    <td>${rank}</td>
                    <td>${name}</td>
                    <td>${score}</td>
                </tr>
            `;
        });

        // تحديث منصة التتويج بالأسماء والدرجات الحقيقية
        if (data.length >= 1) {
            let name1 = data[0].name || data[0["الاسم"]] || "";
            let score1 = data[0].score !== undefined ? data[0].score : (data[0]["الدرجة"] || 0);
            if(document.getElementById("firstName")) document.getElementById("firstName").textContent = name1;
            if(document.getElementById("firstScore")) document.getElementById("firstScore").textContent = score1 + " درجة";
        }
        if (data.length >= 2) {
            let name2 = data[1].name || data[1["الاسم"]] || "";
            let score2 = data[1].score !== undefined ? data[1].score : (data[1]["الدرجة"] || 0);
            if(document.getElementById("secondName")) document.getElementById("secondName").textContent = name2;
            if(document.getElementById("secondScore")) document.getElementById("secondScore").textContent = score2 + " درجة";
        }
        if (data.length >= 3) {
            let name3 = data[2].name || data[2["الاسم"]] || "";
            let score3 = data[2].score !== undefined ? data[2].score : (data[2]["الدرجة"] || 0);
            if(document.getElementById("thirdName")) document.getElementById("thirdName").textContent = name3;
            if(document.getElementById("thirdScore")) document.getElementById("thirdScore").textContent = score3 + " درجة";
        }
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// كود البحث الذكي
const searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll("#tableBody tr").forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
        });
    });
}

// تشغيل الدالة فوراً عند تحميل الصفحة
loadData();
// تحديث تلقائي كل 30 ثانية
setInterval(loadData, 30000);
