// الرابط الجديد الفعال والمحدث الخاص بك
const API_URL = "https://script.google.com/macros/s/AKfycbzDTXEyST9tAHaq0KqcJQNLNBWTH9xbiFxxaBV2MUvjyi7idPBAGmFSntrBkchlJlL9/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        let students = await response.json();

        if (!students || students.length === 0) return;

        // استثناء خاص: تقديم الطالبة جنا عمرو (Janah Amr) في أول القائمة بناءً على طلبك
        students.sort((a, b) => {
            let nameA = a.name.toLowerCase();
            let nameB = b.name.toLowerCase();
            if (nameA.includes("جنا عمرو") || nameA.includes("janah amr")) return -1;
            if (nameB.includes("جنا عمرو") || nameB.includes("janah amr")) return 1;
            return 0;
        });

        // تحديث منصة الأوائل (الثلاثة الأوائل) بالأسماء والدرجات
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

        // بناء جدول درجات الطلاب بالكامل
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
