import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { AuthDataSource } from "../services/auth-datasource";
import { useAuthStore } from "../context/auth-store";
import { ref } from "vue";

export function useAuth() {
    const router = useRouter();
    const toast = useToast();
    const authStore = useAuthStore();
    const loading = ref(false);

    function login(){
        const loginUrl = AuthDataSource.getInstance().getMicrosoftLoginUrl();
        window.location.href = loginUrl;
    }

    async function handleCallBack(tokenParam: string| null): Promise<void> {
        if(!tokenParam){
            toast.error("No se recibió token de autenticación.");
            return;
        }

        try {
            loading.value = true;
            localStorage.setItem("edu-assistant-token", tokenParam);
            authStore.token = tokenParam;

            co
        }
    }

}